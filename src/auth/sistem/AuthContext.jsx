import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import API from "@services";
import { jwtDecode } from "jwt-decode";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [token, setToken] = useState(() => localStorage.getItem("authToken"));
    const [loadingServer, setLoadingServer] = useState(true);

    // Flag para evitar múltiplos loops de retry quando várias requisições falham ao mesmo tempo
    const isRetryingRef = useRef(false);

    // Query para buscar os dados do perfil e permissões
    const { 
        data: profileData, 
        isLoading: isLoadingProfile,
        isFetched
    } = useQuery({
        queryKey: ["perfil"],
        queryFn: async () => {
            const response = await API.getPerfil();
            if (response?.ok && response?.conta) {
                return {
                    user: response.conta,
                    permissoes: response.permissoes
                };
            }
            throw new Error("Perfil não encontrado");
        },
        enabled: !!token,
        staleTime: 0, // Força revalidação na troca de tela (mount)
        retry: false,
    });

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setToken(null);
        queryClient.setQueryData(["perfil"], null);
        queryClient.removeQueries({ queryKey: ["perfil"] });
    }, [queryClient]);

    const login = useCallback(async (data) => {
        try {
            const response = await API.login(data);
            if (response.ok && response.token) {
                const { token, conta, permissoes: perms } = response;
                localStorage.setItem("authToken", token);
                setToken(token);
                // Pré-popula a query para evitar loading imediato após login
                queryClient.setQueryData(["perfil"], {
                    user: conta,
                    permissoes: perms
                });
                return { ok: true };
            } else {
                return { ok: false, message: response.error || "Login failed" };
            }
        } catch (error) {
            console.error(error);
            return { ok: false, message: "Ocorreu um erro durante o login" };
        }
    }, [queryClient]);

    /**
     * Verifica apenas se o token local ainda é válido.
     * A busca de dados (perfil/permissões) é delegada ao useQuery.
     */
    const verificLogin = useCallback(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Token inválido:", error);
                logout();
            }
        } else {
            setToken(null);
        }
    }, [logout]);

    const initServer = useCallback(async () => {
        const tentarConectar = async () => {
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

    // Inicialização do servidor (ping)
    useEffect(() => {
        const init = async () => {
            await initServer();
            setLoadingServer(false);
        };
        init();
    }, [initServer]);

    // Sincroniza o token inicial
    useEffect(() => {
        verificLogin();
    }, [verificLogin]);

    // Detecta queda do servidor mid-session
    useEffect(() => {
        const handleServerOffline = async () => {
            if (isRetryingRef.current) return;
            isRetryingRef.current = true;
            console.warn("[AuthContext] Servidor offline detectado. Aguardando reconexão...");
            setLoadingServer(true);

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
            setLoadingServer(false);
        };

        window.addEventListener("server:offline", handleServerOffline);
        return () => window.removeEventListener("server:offline", handleServerOffline);
    }, []);

    // Escuta o evento de 401
    useEffect(() => {
        const handleUnauthorized = () => {
            console.warn("[AuthContext] Token expirado ou inválido. Fazendo logout.");
            logout();
        };
        window.addEventListener("auth:401", handleUnauthorized);
        return () => window.removeEventListener("auth:401", handleUnauthorized);
    }, [logout]);

    const user = profileData?.user || null;
    const permissoes = profileData?.permissoes || null;

    // Loading final: espera o servidor acordar E (se tiver token) espera a primeira busca de perfil
    const loading = loadingServer || (!!token && isLoadingProfile && !isFetched);

    const authValue = React.useMemo(() => ({
        user,
        token,
        loading,
        permissoes,
        pode: (permissao) => !!permissoes?.[permissao],
        login,
        logout,
        isAutenticated: () => !!token && !!user,
        verificLogin,
        initServer,
    }), [user, token, loading, permissoes, login, logout, verificLogin, initServer]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

