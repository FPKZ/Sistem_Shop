/**
 * Mapa centralizado de permissões por cargo.
 * O backend é a única fonte da verdade — o frontend apenas lê.
 * 
 * Cargos disponíveis: Admin, Gerente, User
 */
export const PERMISSOES = {
  admin: {
    // Usuários
    gerenciarUsuarios:    true,
    aprovarSolicitacoes:  true,
    // Produtos
    cadastrarProduto:     true,
    editarProduto:        true,
    deletarProduto:       true,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       true,
    verVendas:            true,
    // Notas
    gerenciarNotas:       true,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    true,
  },
  gerente: {
    // Usuários
    gerenciarUsuarios:    false,
    aprovarSolicitacoes:  false,
    // Produtos
    cadastrarProduto:     true,
    editarProduto:        true,
    deletarProduto:       true,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       true,
    verVendas:            true,
    // Notas
    gerenciarNotas:       true,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    true,
  },
  vendedor: {
    // Usuários
    gerenciarUsuarios:    false,
    aprovarSolicitacoes:  false,
    // Produtos
    cadastrarProduto:     false,
    editarProduto:        false,
    deletarProduto:       false,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       false,
    verVendas:            true,
    // Notas
    gerenciarNotas:       false,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    false,
    cadastrarCliente:     true,
    editarCliente:        false,
    deletarCliente:       false,
  },
};

/**
 * Retorna as permissões de um cargo. Fallback para User em caso de cargo inválido.
 * @param {string} cargo
 */
export function getPermissoes(cargo) {
  return PERMISSOES[cargo] ?? PERMISSOES.vendedor;
}

export function getAllPermissoes() {
  return PERMISSOES;
}
