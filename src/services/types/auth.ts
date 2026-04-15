import { BaseEntity } from "./http";

export interface Permissoes {
  gerenciarUsuarios:   boolean;
  aprovarSolicitacoes: boolean;
  cadastrarProduto:    boolean;
  editarProduto:       boolean;
  deletarProduto:      boolean;
  realizarVendas:      boolean;
  cancelarVendas:      boolean;
  verVendas:           boolean;
  gerenciarNotas:      boolean;
  verDashboard:        boolean;
  gerenciarClientes:   boolean;
}

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  role?: 'admin' | 'gerente' | 'vendedor';
  cargo?: string;
  status?: 'Ativo' | 'Inativo';
  criado_por?: number | null;
  isSuperAdmin?: boolean;
  img?: string;
}

export interface LoginResponse {
  token: string;
  conta: Usuario;
  permissoes: Permissoes;
}
