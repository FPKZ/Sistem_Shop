import API from "@services"
import { useEffect, useState, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "../useForm"
import { DropdownItemText } from "react-bootstrap"
import useModalConfirm from "../useModalConfirm"
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao"
import { usePagination } from "@hooks/usePagination"
import { useScrollRestoration } from "../useScrollRestoration"
import { useHistoryBack } from "../useHistoryBack"

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

    console.log(produtos)

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
        handleChange("quantidade", produto.quantidade === "Esgotado" ? 0 : 1)
        setProdutoSelecionado(produto)
    }

    const adicionarAoCarrinho = () => {
        setCarrinho((prev) => {
            const itemExistente = prev.find(item => item.id === formValue.id && item.cor === formValue.cor && item.tamanho === formValue.tamanho);
            if(itemExistente){
                if(itemExistente.quantidade + formValue.quantidade > produtoSelecionado.quantidade){
                    // alert("Quantidade indisponível!");
                    return prev;
                }
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

    // ============================================
    // INTEGRAÇÃO DE COMPONENTES E FILTROS (MIGRADO)
    // ============================================

    const topRef = useRef(null);
    const whatsappRef = useRef(null);
    const [talkExpanded, setTalkExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { dadosProcessados, filtro, setFiltro, ordenarPorChave } = useFiltroOrdenacao(produtos, [
        "nome",
        "categoria",
        { path: "tags", subCampos: ["label"] },
    ], ["quantidade", "Esgotado"]);

    const { 
        currentPage, itemsPerPage, currentItems, totalPages, totalItems,
        indexOfFirstItem, indexOfLastItem, handlePageChange, handleItemsPerPageChange,
    } = usePagination(dadosProcessados, 20);

    // Controles de Scroll Seguro
    const handlePageChangeSafely = (page) => {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (topRef?.current) topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
        setTimeout(() => handlePageChange(page), 10);
    };

    const handleItemsPerPageChangeSafely = (e) => {
        const value = e.target.value;
        window.scrollTo({ top: 0, behavior: "instant" });
        if (topRef?.current) topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
        setTimeout(() => handleItemsPerPageChange({ target: { value } }), 10);
    };

    useScrollRestoration(carrinhoAberto || telaProduto, topRef, [currentPage, filtro, totalPages, itemsPerPage], [carrinhoAberto, telaProduto]);

    useHistoryBack([
        { isOpen: carrinhoAberto, close: () => setCarrinhoAberto(false) },
        { isOpen: telaProduto, close: () => setTelaProduto(false) },
        { isOpen: menu, close: () => setMenu(false) }
    ]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
                setTalkExpanded(false);
            }
        }
        if (talkExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [talkExpanded]);


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

        // Ref sources and States from UI
        topRef, whatsappRef, talkExpanded, setTalkExpanded, isHovered, setIsHovered,
        
        // Pagination & Filter Sources
        dadosProcessados, filtro, setFiltro, ordenarPorChave,
        currentPage, itemsPerPage, currentItems, totalPages, totalItems,
        indexOfFirstItem, indexOfLastItem, handlePageChangeSafely, handleItemsPerPageChangeSafely
    }
}
