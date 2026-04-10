import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import API from "@app/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
    }, []);

    const verificLogin = useCallback(async () => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                    setToken(storedToken);
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
        setLoading(false);
    }, [logout]);

    const login = useCallback(async (data) => {
        try {
            const response = await API.login(data);
            if (response.ok && response.token) {
                const { token, conta } = response;
                localStorage.setItem("authToken", token);
                const decoded = jwtDecode(token);
                setUser({ email: decoded.email, ...conta });
                setToken(token);
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

    const initServer = useCallback(async () => {
        setLoading(true);
        await API.initServer();
        setLoading(false);
    }, []);

    // Inicializa o estado de autenticação
    useEffect(() => {
        initServer().then(verificLogin);
    }, [initServer, verificLogin]);

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
        login,
        logout,
        isAutenticated,
        verificLogin,
        initServer,
    }), [user, token, loading, isAutenticated, login, logout, verificLogin, initServer]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);