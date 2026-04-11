import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "@app/api.js";
import usePopStateModal from "@hooks/usePopStateModal";
import { useToast } from "@contexts/ToastContext";

export default function useProdutosPage() {
  const { mobile } = useOutletContext();
  const { showToast } = useToast();

  const [produto, setProduto] = useState({});
  const [modalAddProduto, setModalAddProduto] = useState(false);
  const [modalInfoProduto, setModalInfoProduto] = useState(false);

  const navigate = useNavigate();

  const { data: coresData } = useQuery({
    queryKey: ["cores"],
    queryFn: async () => {
      const res = await API.getCores();
      return res?.data || [];
    }
  });
  const cores = coresData?.data || coresData || [];

  const { data: produtos } = API.getProdutos();
  const deletarItemMutation = API.useDeletarItem();

  // Sincronização: Se o produto selecionado estiver no modal, 
  // e a lista de produtos mudar (ex: após deletar item), atualiza o estado local 'produto' com os novos dados
  useEffect(() => {
    if (modalInfoProduto && produto?.id && produtos) {
      const produtoAtualizado = produtos.find(p => p.id === produto.id);
      if (produtoAtualizado) {
        setProduto(produtoAtualizado);
      }
    }
  }, [produtos, modalInfoProduto, produto?.id]);

  usePopStateModal(
    [modalAddProduto, modalInfoProduto],
    [setModalAddProduto, setModalInfoProduto]
  );

  const deleteProduto = async (id) => {
    try {
      const response = await deletarItemMutation.mutateAsync(id);
      if (!response || response.ok) {
        showToast(response?.message || "Item deletado com sucesso", "success");
      } else {
        showToast(response.error || "Erro ao deletar item", "error");
      }
    } catch {
      showToast("Erro ao deletar item", "error");
    }
  };
  console.log(produtos)

  return {
    mobile,
    produtos: produtos || [],
    produto,
    setProduto,
    cores: cores || [],
    cadastrarProduto: () => navigate("/cadastro/produto"),
    modalInfoProduto,
    setModalInfoProduto,
    deleteProduto,
  };
}
