/**
 * Mapa centralizado de permissões por cargo.
 * O backend é a única fonte da verdade — o frontend apenas lê.
 * 
 * Cargos disponíveis: Admin, Gerente, User
 */
export const PERMISSOES = {
  admin: {
    // Usuários
    verUsuarios:          true,
    gerenciarUsuarios:    true,
    aprovarSolicitacoes:  true,
    // Cadastro
    verCadastros:         true,
    // Produtos
    verProdutos:          true,
    cadastrarProduto:     true,
    editarProduto:        true,
    deletarProduto:       true,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       true,
    verVendas:            true,
    realizarExtorno:      true,
    // Notas
    verNotas:             true,
    cadastrarNotas:       true,
    editarNotas:          true,
    deletarNotas:         true,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    true,
    verClientes:          true,
    cadastrarCliente:     true,
    editarCliente:        true,
    deletarCliente:       true,
  },
  gerente: {
    // Usuários
    verUsuarios:          false,
    gerenciarUsuarios:    false,
    aprovarSolicitacoes:  false,
    // Cadastro
    verCadastros:         true,
    // Produtos
    verProdutos:          true,
    cadastrarProduto:     true,
    editarProduto:        true,
    deletarProduto:       false,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       true,
    verVendas:            true,
    realizarExtorno:      true,
    // Notas
    verNotas:             true,
    cadastrarNotas:       true,
    editarNotas:          false,
    deletarNotas:         false,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    true,
    verClientes:          true,
    cadastrarCliente:     true,
    editarCliente:        true,
    deletarCliente:       false,
  },
  vendedor: {
    // Usuários
    verUsuarios:          false,
    gerenciarUsuarios:    false,
    aprovarSolicitacoes:  false,
    // Cadastro
    verCadastros:         true,
    // Produtos
    verProdutos:          true,
    cadastrarProduto:     false,
    editarProduto:        false,
    deletarProduto:       false,
    // Vendas
    realizarVendas:       true,
    cancelarVendas:       true,
    verVendas:            true,
    realizarDevolução:    false,
    realizarExtorno:      false,
    // Notas
    verNotas:             false,
    cadastrarNotas:       false,
    editarNotas:          false,
    deletarNotas:         false,
    // Dashboard
    verDashboard:         true,
    // Clientes
    gerenciarClientes:    false,
    verClientes:          true,
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
