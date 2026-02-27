interface getProdutosProps {
    item?: "estoque" | "vendidos" | "reservado" | "all" | string,
    nome?: string
}

interface ItemEstoque {
    nome: string;
    marca: string;
    codigo_barras: string;
    cor: string;
    tamanho: string;
    status: string;
    nota: number;
    valor_compra: number;
    valor_venda: number;
    lucro: number;
}

interface Produto {
    nome: string;
    categoria: number;
    descricao: string;
    imagem: File;
    itemEstoque: Array<ItemEstoque>;

}

export {getProdutosProps, ItemEstoque, Produto}