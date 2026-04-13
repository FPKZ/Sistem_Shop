import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import API from "@services";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [permissoes, setPermissoes] = useState(null);

    // Flag para evitar múltiplos loops de retry quando várias requisições falham ao mesmo tempo
    const isRetryingRef = useRef(false);

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
        setPermissoes(null);
    }, []);

    /**
     * Verifica o token armazenado localmente e seta o estado do usuário.
     * Opera apenas sobre o localStorage — sem chamadas de rede.
     * O controle de `loading` NÃO é feito aqui; é responsabilidade do useEffect de boot.
     */
    const verificLogin = useCallback(async () => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    // Token local válido — confirma existência no banco
                    setToken(storedToken);
                    try {
                        const perfil = await API.getPerfil();
                        if (perfil?.ok && perfil?.conta) {
                            setUser({ email: decoded.email, ...perfil.conta });
                            if (perfil?.permissoes) setPermissoes(perfil.permissoes);
                        } else {
                            // Usuário não encontrado no banco
                            logout();
                        }
                    } catch {
                        // Se der erro de rede não faz logout (servidor pode estar offline)
                        // O initServer() vai lidar com isso
                        setUser(decoded);
                    }
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Token inválido:", error);
                logout();
            }
        } else {
            setUser(null);
        }
    }, [logout]);

    const login = useCallback(async (data) => {
        try {
            const response = await API.login(data);
            if (response.ok && response.token) {
                const { token, conta, permissoes: perms } = response;
                localStorage.setItem("authToken", token);
                const decoded = jwtDecode(token);
                setUser({ email: decoded.email, ...conta });
                setToken(token);
                if (perms) setPermissoes(perms);
                return { ok: true };
            } else {
                return { ok: false, message: response.error || "Login failed" };
            }
        } catch (error) {
            console.error(error);
            return { ok: false, message: "Ocorreu um erro durante o login" };
        }
    }, []);

    const isAutenticated = useCallback(() => !!user, [user]);

    /**
     * Faz ping ao backend com retry automático — a Promise só resolve quando o
     * servidor responder com sucesso (HTTP 200). Isso mantém a tela de loading
     * visível enquanto o servidor está acordando (ex: Render free tier saindo do sleep).
     *
     * Fluxo:
     *   1ª tentativa → backend offline → aguarda 3s → tenta novamente → ...
     *   Qualquer tentativa com resposta ok → resolve → loading é liberado
     */
    const initServer = useCallback(async () => {
        const tentarConectar = async () => {
            // API.initServer() retorna o objeto Response em sucesso,
            // ou undefined se ocorrer erro de rede (ECONNREFUSED, timeout, etc.)
            const response = await API.initServer();
            return !!(response && response.ok);
        };

        let online = await tentarConectar();

        while (!online) {
            console.info("[AuthContext] Servidor offline. Nova tentativa em 3s...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            online = await tentarConectar();
        }
    }, []);

    // Inicialização do sistema em paralelo:
    // - verificLogin: operação local (localStorage) — instantânea
    // - initServer: ping ao backend — aguarda o servidor acordar
    // Loading só é liberado quando AMBOS completam, garantindo que:
    //   1. A tela de loading aparece enquanto o servidor dorme
    //   2. O token é verificado sem esperar a rede
    useEffect(() => {
        const init = async () => {
            await Promise.all([verificLogin(), initServer()]);
            setLoading(false);
        };
        init();
    }, [initServer, verificLogin]);

    // Detecta queda do servidor mid-session:
    // Quando httpClient dispara "server:offline" (erro de rede em qualquer requisição),
    // exibe a tela de loading e inicia retry automático a cada 3s até reconectar.
    useEffect(() => {
        const handleServerOffline = async () => {
            // Guard: se já está em retry, ignora eventos duplicados
            // (várias requisições podem falhar ao mesmo tempo quando o servidor cai)
            if (isRetryingRef.current) return;
            isRetryingRef.current = true;

            console.warn("[AuthContext] Servidor offline detectado. Aguardando reconexão...");
            setLoading(true);

            const tentarConectar = async () => {
                const response = await API.initServer();
                return !!(response && response.ok);
            };

            let online = false;
            while (!online) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                online = await tentarConectar();
            }

            console.info("[AuthContext] Servidor reconectado. Retomando sessão.");
            isRetryingRef.current = false;
            setLoading(false);
        };

        window.addEventListener("server:offline", handleServerOffline);
        return () => window.removeEventListener("server:offline", handleServerOffline);
    }, []);

    // Escuta o evento de 401 disparado pelo httpClient → faz logout automático
    useEffect(() => {
        const handleUnauthorized = () => {
            console.warn("[AuthContext] Token expirado ou inválido. Fazendo logout.");
            logout();
        };
        window.addEventListener("auth:401", handleUnauthorized);
        return () => window.removeEventListener("auth:401", handleUnauthorized);
    }, [logout]);

    const authValue = React.useMemo(() => ({
        user,
        token,
        loading,
        permissoes,
        pode: (permissao) => !!permissoes?.[permissao],
        login,
        logout,
        isAutenticated,
        verificLogin,
        initServer,
    }), [user, token, loading, permissoes, isAutenticated, login, logout, verificLogin, initServer]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
