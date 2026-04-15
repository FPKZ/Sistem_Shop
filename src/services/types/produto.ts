import { BaseEntity } from "./http";

export interface Cor extends BaseEntity {
    name: string;
    hex: string;
}

export interface Categoria extends BaseEntity {
    nome: string;
    descricao?: string;
}

export interface ItemEstoque extends BaseEntity {
    fornecedor_id?: number | null;
    nota_id?: number | null;
    produto_id: number;
    marca: string;
    codigo_barras: string;
    tamanho: string;
    cor: string;
    quantidade: number;
    quantidade_vendida: number;
    valor_compra: number;
    valor_venda: number;
    lucro: number;
    status: 'estoque' | 'vendidos' | 'reservado';
    vendidos?: number;
    reservas?: number;
    ItemVendas?: any[];
}

export interface Produto extends BaseEntity {
    nome: string;
    descricao?: string;
    categoria_id?: number | null;
    categoria?: Categoria;
    itens?: ItemEstoque[];
    imagens?: ProdutoImagem[];
}

export interface ProdutoImagem extends BaseEntity {
    produto_id: number;
    url: string;
}

export interface ProdutoFiltros {
    item?: "estoque" | "vendidos" | "reservado" | "all" | string;
    nome?: string;
    id?: string;
}

export interface CategoriaFiltros {
    id?: number | string;
    hex?: string;
    name?: string;
}
