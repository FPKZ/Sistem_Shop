import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useBuscaVendas } from "./useBuscaVendas";
import { useRequestHandler } from "@hooks/useRequestHandler";
import API from "@services";

/**
 * Hook específico para a página de Estorno de Venda.
 */
export function useEstorno() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlVendaId = searchParams.get("vendaId");

  const busca = useBuscaVendas();
  const { handleRequest, isLoading: isRequesting } = useRequestHandler();
  const [showConfirm, setShowConfirm] = useState(false);

  // Carregar venda da URL se houver
  useEffect(() => {
    if (urlVendaId) {
      busca.carregarVenda(urlVendaId);
    }
  }, [urlVendaId, busca.carregarVenda]);

  const handleConfirmarEstorno = () => {
    if (!busca.venda) return;
    setShowConfirm(true);
  };

  const confirmarEstornoReal = async () => {
    setShowConfirm(false);
    
    await handleRequest(
      () => API.putEstorno(busca.venda.id),
      {
        successMessage: "Estorno realizado com sucesso!",
        errorMessage: "Erro ao realizar estorno",
      }
    ).then((response) => {
      if (response && response.ok) {
        busca.resetSearch();
        navigate("/painel/vendas");
      }
    });
  };

  return {
    ...busca,
    isLoading: busca.loading || isRequesting,
    showConfirm,
    setShowConfirm,
    handleConfirmarEstorno,
    confirmarEstornoReal
  };
}
