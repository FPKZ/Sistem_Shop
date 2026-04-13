import { useAuth } from "@auth-sistem/AuthContext";

/**
 * Hook para verificar permissões do usuário logado.
 * As permissões são definidas pelo backend (RBAC server-side) e retornadas no login.
 * 
 * @example
 * const { pode, permissoes } = usePermissoes();
 * 
 * // Verifica uma permissão específica
 * if (pode("gerenciarUsuarios")) { ... }
 * 
 * // Renderização condicional
 * {pode("cadastrarProduto") && <BotaoCadastrar />}
 */
export function usePermissoes() {
  const { permissoes, pode } = useAuth();

  return {
    /** Objeto completo com todas as permissões do usuário */
    permissoes,
    /**
     * Verifica se o usuário tem uma permissão específica.
     * @param {string} permissao - Nome da permissão (ex: "gerenciarUsuarios")
     * @returns {boolean}
     */
    pode,
  };
}
