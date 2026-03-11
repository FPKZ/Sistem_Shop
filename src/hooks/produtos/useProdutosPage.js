import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import API from "@app/api.js";
import usePopStateModal from "@hooks/usePopStateModal";
import { useToast } from "@contexts/ToastContext";

export default function useProdutosPage() {
  const { mobile } = useOutletContext();
  const { showToast } = useToast();

  const [produto, setProduto] = useState({});
  const [modalAddProduto, setModalAddProduto] = useState(false);
  const [modalInfoProduto, setModalInfoProduto] = useState(false);

  const { data: produtos } = API.getProdutos();
  const cadastrarMutation = API.useCadastrarProduto();
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

  const cadastroProduto = async (data) => {
    try {
      const response = await cadastrarMutation.mutateAsync(data);
      if (response.ok) {
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
      return response;
    } catch {
      showToast("Erro ao cadastrar produto", "error");
    }
  };

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

  return {
    mobile,
    produtos: produtos || [],
    produto,
    setProduto,
    modalAddProduto,
    setModalAddProduto,
    modalInfoProduto,
    setModalInfoProduto,
    cadastroProduto,
    deleteProduto,
  };
}
