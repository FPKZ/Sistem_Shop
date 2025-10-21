import React, { createContext, useState, useContext, useEffect } from "react";
import API from "@app/api";
import { jwtDecode } from "jwt-decode";
import LoadingPage from "./LoadingPage"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        initServer()
    },[])

    const verificLogin = async () => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            try{
                const decoded = jwtDecode(storedToken);
                if(decoded.exp * 1000 > Date.now()) {
                    setUser( decoded );
                    setToken(storedToken);
                } else{
                    localStorage.removeItem("authToken");
                }
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem("authToken");
            }
        }
        else{
            setUser(null)
        }
        // await initServer()
        setLoading(false);
    }

    const login = async (data) => {
        try {
            const response = await API.login(data);
            if (response.ok && response.token) {
                const { token, conta } = response;
                localStorage.setItem("authToken", token);
                const decoded = jwtDecode(token);
                setUser({email: decoded.email, ...conta});
                setToken(token);
                return { ok: true };
            } else {
                return { ok: false, message: response.error || "Login failed" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "An error occurred during login" };
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
    };

    const isAutenticated = () => {
        return !!user;
    }

    const initServer = async () => {
        setLoading(true)
        const response = await API.initServer()
        setLoading(false)
        console.log(response)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAutenticated, verificLogin, initServer }}>
            {loading ? <LoadingPage /> :  children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
}