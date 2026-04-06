import API from "@app/api"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "../useForm"
import { DropdownItemText } from "react-bootstrap"
import useModalConfirm from "../useModalConfirm"

export default function useCatalogo(){
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)

    const [telaProduto, setTelaProduto] = useState(false)

    const [carrinho, setCarrinho] = useState([]) // { idProduto: quantidade }
    const [carrinhoAberto, setCarrinhoAberto] = useState(false)

    const [menu, setMenu] = useState(false)
    const [obs, setObs] = useState("")
    const [loading, setLoading] = useState(false)

    const { formValue, handleChange } = useForm({
        id: 0,
        cor: "",
        tamanho: "",
        quantidade: 0,
    },{
        transformers: {
            id: (val) => Number(val),
            quantidade: (val) => Number(val),
        },
        validators: {
            id: (val) => val <= 0 ? "Selecione um produto" : null,
            cor: (val) => val === "" ? "Selecione uma cor" : null,
            tamanho: (val) => val === "" ? "Selecione um tamanho" : null,
            quantidade: (val) => val <= 0 ? "Quantidade inválida" : null,
        }
    })

    const { openModal } = useModalConfirm();


    const { data: produtosData } = useQuery({
        queryKey: ["catalogo"],
        queryFn: async () => {
            const dados = await API.getProduto({ categoria: "", nome: "" });
            return dados?.data || [];
        }
    });

    const { data: categoriasData } = useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            const dados = await API.getCategoria();
            return dados?.data || [];
        }
    });

    const produtos = produtosData?.data || produtosData || [];
    const categorias = categoriasData?.data || categoriasData || [];

    useEffect(() => {
        if (Object.keys(carrinho).length === 0) {
            setCarrinhoAberto(false)
        }
    }, [carrinho])

    const handleChangeQuantity = (id, delta = 1) => {
        const quantidade = formValue.quantidade + delta
        if(quantidade <= 0) return;
        if(quantidade > produtoSelecionado.quantidade) return;
        handleChange("quantidade", quantidade)
    };

    const selecionarProduto = (produto) => {
        handleChange("id", produto.id)
        handleChange("cor", produto.cores[0]?.hex || "")
        handleChange("tamanho", produto.tamanho[0] || "")
        handleChange("quantidade", 1)
        setProdutoSelecionado(produto)
    }

    const adicionarAoCarrinho = () => {
        setCarrinho((prev) => {
            const itemExistente = prev.find(item => item.id === formValue.id && item.cor === formValue.cor && item.tamanho === formValue.tamanho);
            if(itemExistente){
                return prev.map(item => item.id === formValue.id && item.cor === formValue.cor && item.tamanho === formValue.tamanho ? {...item, quantidade: item.quantidade + formValue.quantidade} : item);
            }
            return [
                ...prev,
                {...formValue}
            ]
        })
    }

    const removerItemDoCarrinho = (i) => {
        openModal("Remover Item", "Tem certeza que deseja remover este item do carrinho?", {
            confirm: () => {
                setCarrinho((prev) => prev.filter((_, index) => index !== i));
            }
        });
    }
    
    const alterarQuantidade = (i, id, quantidade) => {
        const produto = produtos.find(item => item.id === id);
        setCarrinho((prev) => {
            const item = prev[i]
            if(item){
                // Se a quantidade for chegar a 0, não faz nada (a remoção deve ser via removerItemDoCarrinho)
                if(item.quantidade + quantidade <= 0) return prev;
                
                return prev.map((item, index) => 
                    index === i ? 
                        item.quantidade + quantidade > produto.quantidade ? 
                            item 
                        : 
                            {...item, quantidade: item.quantidade + quantidade} 
                    : item
                );
            }
            return prev;
        }
        );
    }

    const totalItens = carrinho.length;

    const pedir = async () => {
        if (totalItens === 0) return alert("Adicione itens ao carrinho!");

        if (!carrinhoAberto) {
            setCarrinhoAberto(true);
            return;
        };
        
        const pedidoArray = carrinho.map((item) => ({
            id: Number(item.id),
            cor: item.cor,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
        }));

        try {
            setLoading(true);
            const result = await API.postPedido({ pedido: pedidoArray, total: valorTotal, observacao: obs });
            if (result && result.url) {
                window.open(result.url, "_blank");
            }
        } catch (error) {
            console.error("Erro ao fazer pedido:", error);
            alert("Ocorreu um erro ao finalizar o pedido.");
        } finally {
            setLoading(false);
        }
    }

    const handleBadge = (id) => {
        const item = carrinho.map(item => item.id === id ? item.quantidade : undefined).filter(item => item !== undefined).reduce((acc, item) => acc + item, 0);
        if(item > 0){
            return (
                <div 
                    key={`badge-${item}`}
                    className="
                        position-absolute top-2 end-2 
                        bg-[#f333f3] 
                        rounded-circle shadow-sm
                        d-flex align-items-center justify-content-center
                        text-white
                    " 
                    style={{ width: "1.7rem", height: "1.7rem", fontSize: "0.9rem" }}
                >
                    {item}
                </div>
            )
        }
    }

    // Calcula o valor total do carrinho
    const valorTotal = carrinho.reduce((acc, item) => {
        const produto = produtos.find(p => p.id === Number(item.id));
        return acc + (produto ? Number(produto.preco) * item.quantidade : 0);
    }, 0);


    const getCor = async (cor) => {
        const result = await API.getCores({hex: cor})
        return result.data
    }


    const handleTalk = () => {
        const number = import.meta.env.VITE_WHATSAPP_NUMBER;
        const message = `Olá! Gostaria de tirar uma duvida!`
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
    }

    return {
        produtos,
        categorias,
        produtoSelecionado,
        selecionarProduto,
        telaProduto,
        setTelaProduto,
        carrinho,
        formValue,
        handleChange,
        handleChangeQuantity,
        handleBadge,
        totalItens,
        adicionarAoCarrinho,
        removerItemDoCarrinho,
        alterarQuantidade,
        carrinhoAberto,
        setCarrinhoAberto,
        valorTotal,
        pedir,
        obs,
        setObs,
        menu,
        setMenu,
        loading,
        getCor,
        openModal,
        handleTalk,
    }
}