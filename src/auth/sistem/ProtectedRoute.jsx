import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingPage from "./LoadingPage";

/**
 * Rota protegida: redireciona para /login se o usuário não estiver autenticado.
 *
 * A verificação de token ocorre UMA VEZ no boot via AuthProvider.
 * O logout automático por expiração mid-session é coberto pelo event listener
 * "auth:401" registrado no httpClient — não é necessário re-verificar a cada navegação.
 */
export default function ProtectedRoute() {
    const { isAutenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return <LoadingPage />;

    return isAutenticated() ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
