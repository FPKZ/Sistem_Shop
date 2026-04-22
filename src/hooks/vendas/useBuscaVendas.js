import { useState, useCallback } from "react";
import API from "@services";

/**
 * Hook reutilizável para busca unificada de vendas por ID ou Nome (Cliente/Vendedor).
 * Filtra automaticamente vendas inelegíveis (pendentes, estornadas, canceladas).
 */
export function useBuscaVendas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [venda, setVenda] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const buscarVendas = useCallback(async (termo = searchTerm) => {
    if (!termo) {
      setErro("Digite o ID ou nome para buscar");
      return;
    }

    setLoading(true);
    setErro("");
    setResults([]);
    setIsSearching(true);

    try {
      const todasVendas = await API.getVendas();
      let filtradas = [];

      // Se for um número (ID)
      if (!isNaN(termo) && termo.trim() !== "") {
        const idBuscado = parseInt(termo);
        const porId = todasVendas.filter(v => v.id === idBuscado);
        filtradas = porId;
      } else {
        // Busca por nome do cliente ou vendedor
        const t = termo.toLowerCase();
        filtradas = todasVendas.filter(v => 
          v.cliente?.nome?.toLowerCase().includes(t) || 
          v.vendedor?.nome?.toLowerCase().includes(t)
        );
      }

      // Filtro de elegibilidade padrão (pode ser customizado se necessário)
      filtradas = filtradas.filter(v => !["estorno", "cancelada", "pendente"].includes(v.status?.toLowerCase()));

      if (filtradas.length === 0) {
        setErro("Nenhuma venda elegível encontrada");
      } else {
        setResults(filtradas);
      }
    } catch (error) {
      setErro("Erro ao buscar vendas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const carregarVenda = async (id) => {
    setLoading(true);
    setErro("");
    try {
      const todasVendas = await API.getVendas();
      const vendaEncontrada = todasVendas.find(v => v.id === parseInt(id));
      
      if (vendaEncontrada) {
        // Verificação final de segurança
        if (["estorno", "cancelada", "pendente"].includes(vendaEncontrada.status?.toLowerCase())) {
          setErro("Esta venda não está em um status que permite esta operação");
          return;
        }
        setVenda(vendaEncontrada);
        setResults([]);
        setIsSearching(false);
        setSearchTerm(vendaEncontrada.id.toString());
        return vendaEncontrada;
      } else {
        setErro("Venda não encontrada");
      }
    } catch (error) {
      setErro("Erro ao carregar detalhes da venda");
    } finally {
      setLoading(false);
    }
    return null;
  };

  const resetSearch = () => {
    setVenda(null);
    setResults([]);
    setIsSearching(false);
    setSearchTerm("");
    setErro("");
  };

  return {
    searchTerm,
    setSearchTerm,
    venda,
    setVenda,
    results,
    loading,
    erro,
    setErro,
    isSearching,
    buscarVendas,
    carregarVenda,
    resetSearch
  };
}
