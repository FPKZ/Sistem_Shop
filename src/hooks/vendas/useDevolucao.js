import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useBuscaVendas } from "./useBuscaVendas";
import { useRequestHandler } from "@hooks/useRequestHandler";
import API from "@services";

/**
 * Hook específico para a página de Devolução de Produtos.
 */
export function useDevolucao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlVendaId = searchParams.get("vendaId"); // Mantido apesar da observação do usuário, pois é inofensivo e útil internamente se for estendido depois

  const busca = useBuscaVendas();
  const { handleRequest, isLoading: isRequesting } = useRequestHandler();
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Carregar venda da URL se houver (opcional, conforme feedback)
  useEffect(() => {
    if (urlVendaId) {
      busca.carregarVenda(urlVendaId);
    }
  }, [urlVendaId, busca.carregarVenda]);

  // Resetar produtos quando a venda mudar
  useEffect(() => {
    setProdutosSelecionados([]);
  }, [busca.venda]);

  const toggleProduto = (item) => {
    const existe = produtosSelecionados.find((p) => p.id === item.id);

    if (existe) {
      setProdutosSelecionados(
        produtosSelecionados.filter((p) => p.id !== item.id)
      );
    } else {
      setProdutosSelecionados([
        ...produtosSelecionados,
        {
          ...item,
          nome_produto: item.itemEstoque?.nome
        },
      ]);
    }
  };

  const calcularValorDevolucao = () => {
    return produtosSelecionados.reduce(
      (total, item) => total + Number(item.itemEstoque?.valor_venda || 0),
      0
    );
  };

  const handleConfirmarDevolucao = () => {
    if (produtosSelecionados.length === 0) return;
    setShowConfirm(true);
  };

  const confirmarDevolucaoReal = async () => {
    setShowConfirm(false);
    
    const itensDevolverIds = produtosSelecionados.map(p => p.itemEstoque_id);

    const devolucaoPayload = {
      itensDevolverIds,
      valorDevolvido: calcularValorDevolucao(),
    };

    await handleRequest(
      () => API.putDevolucao(busca.venda.id, devolucaoPayload),
      {
        successMessage: "Devolução realizada com sucesso!",
        errorMessage: "Erro ao realizar devolução",
      }
    ).then((response) => {
      if (response && response.ok) {
        busca.resetSearch();
        setProdutosSelecionados([]);
        navigate("/painel/vendas");
      }
    });
  };

  const resetDevolucao = () => {
    busca.resetSearch();
    setProdutosSelecionados([]);
  };

  return {
    ...busca,
    isLoading: busca.loading || isRequesting,
    produtosSelecionados,
    toggleProduto,
    calcularValorDevolucao,
    showConfirm,
    setShowConfirm,
    handleConfirmarDevolucao,
    confirmarDevolucaoReal,
    resetSearch: resetDevolucao
  };
}
