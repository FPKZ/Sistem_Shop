import React from "react";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Rota protegida por permissão específica.
 * Se o usuário não tiver a permissão, redireciona para a página inicial.
 *
 * @param {string} permissao - Nome da permissão necessária (ex: "gerenciarUsuarios")
 * @param {string} redirectTo - Onde redirecionar em caso de acesso negado (padrão: "/")
 *
 * @example
 * <Route path="usuarios" element={<PermissaoRoute permissao="gerenciarUsuarios" />}>
 *   <Route index element={<GerenciamentoUsuario />} />
 * </Route>
 */
export default function PermissaoRoute({ permissao, redirectTo = "/painel" }) {
    const { pode, loading } = useAuth();
    const context = useOutletContext();

    if (loading) return null;

    return pode(permissao) ? <Outlet context={context} /> : <Navigate to={redirectTo} replace />;
}
