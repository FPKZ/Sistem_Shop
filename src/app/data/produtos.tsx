import API from "@app/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

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



 


export function getProdutos({item, nome}:getProdutosProps = {}) {
    return useQuery({
        queryKey: ['produtos'],
        queryFn: () => API.getProduto({item, nome}),
    });
};

export function postProduto(data:Produto) { 
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => API.postProduto(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produtos'] })
        }
    })
};

export function deleteProduto(id:number) { 
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => API.deleteProduto(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['produtos'] })
        }
    })
};



