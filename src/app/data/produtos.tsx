import { useState, useEffect } from "react";
import API from "@app/api";

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


export default function usePprodutos() {
 
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        getProdutos();
    }, []);

    const getProdutos = async ({item, nome}:getProdutosProps = {}) => {
        const p = await API.getProduto({item, nome});
        setProdutos(p || []);
    };

    const postProduto = async (data:Produto) => {
        const p = await API.postProduto(data);
        setProdutos(p || []);
    };

    return [produtos, getProdutos, postProduto];

}