import API from "@app/api"
import { useEffect, useState } from "react"

export default function useCatalogo(){
    const [produtos, setProdutos] = useState([])
    const [carrinho, setCarrinho] = useState({}) // { idProduto: quantidade }
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)
    
    useEffect(() => {
        API.getProduto({}).then((dados) => {
            if (dados && dados.catalogo) {
                setProdutos(dados.catalogo)
            } else if (Array.isArray(dados)) {
                setProdutos(dados)
            }
        })
    }, [])

    useEffect(() => {
        if (Object.keys(carrinho).length === 0) {
            setCarrinhoAberto(false)
        }
    }, [carrinho])

    const handleChangeQuantity = (id, delta) => {
        setCarrinho((prev) => {
            const current = prev[id] || 0;
            const next = current + delta;
            
            if (next <= 0) {
                const newCarrinho = { ...prev };
                delete newCarrinho[id];
                return newCarrinho;
            }
            else if (next > produtos.find(p => p.id === id).quantidade) {
                return prev;
            }
            return { ...prev, [id]: next };
        });
    };

    const totalItens = Object.values(carrinho).reduce((acc, q) => acc + q, 0);

    const pedir = async () => {
        if (totalItens === 0) return alert("Adicione itens ao carrinho!");

        if (!carrinhoAberto) {
            setCarrinhoAberto(true);
            return;
        };
        
        const pedidoArray = Object.entries(carrinho).map(([id, quantidade]) => ({
            id: Number(id),
            quantidade,
        }));

        try {
            const result = await API.postPedido({ pedido: pedidoArray, total: valorTotal });
            if (result && result.url) {
                window.open(result.url, "_blank");
            }
        } catch (error) {
            console.error("Erro ao fazer pedido:", error);
            alert("Ocorreu um erro ao finalizar o pedido.");
        }
    }

    // Calcula o valor total do carrinho
    const valorTotal = Object.entries(carrinho).reduce((acc, [id, quantidade]) => {
        const produto = produtos.find(p => p.id === Number(id));
        return acc + (produto ? Number(produto.preco) * quantidade : 0);
    }, 0);

    return {
        produtos,
        carrinho,
        handleChangeQuantity,
        totalItens,
        carrinhoAberto,
        setCarrinhoAberto,
        valorTotal,
        pedir
    }
}