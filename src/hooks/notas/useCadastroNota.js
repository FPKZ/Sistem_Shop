import { useState, useEffect } from "react";
import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroNota(onSuccess) {
  const [incluirProdutos, setIncluirProdutos] = useState(false);
  const [itemEstoque, setItemEstoque] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [modalCadastroPrduto, setmodalCadastroPrduto] = useState(false);
  const [modalInfoProduto, setmodalInfoProduto] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState(null);

  const { isLoading, handleRequest } = useRequestHandler();
  const valorTotalHook = useCurrencyInput({ initialValue: 0 });

  const {
    formValue,
    setFormValue,
    erros,
    validated, // eslint-disable-line no-unused-vars
    handleChange,
    validate,
  } = useForm(
    {},
    {
      validators: {
        codigo: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        fornecedor: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
      },
    },
  );

  useEffect(() => {
    if (incluirProdutos) {
      const totalItens = produtos.reduce(
        (acc, p) => acc + (p.itens?.length || 0),
        0,
      );
      setFormValue((prev) => ({
        ...prev,
        quantidade: totalItens,
      }));
    }
  }, [produtos, incluirProdutos, setFormValue]);

  function cadastrarProduto(payload) {
    if (!payload) return;

    // Geramos um identificador único simples apenas para controle da lista na tabela do front (remoção)
    const novaEntrada = {
      ...payload,
      _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    };

    setProdutos((prev) => [...prev, novaEntrada]);
  }

  async function removerProduto(_id) {
    const produtoParaRemover = produtos.find((p) => p._id === _id);
    if (produtoParaRemover && produtoParaRemover.imgs?.length > 0) {
      // Deletar as imagens do servidor físico (Vercel Blob) para evitar lixo
      const delecoes = produtoParaRemover.imgs.map((url) => API.deleteImagem(url));
      await Promise.all(delecoes).catch((err) =>
        console.error("Erro ao deletar imagens de produto removido da nota:", err),
      );
    }
    setProdutos((prev) => prev.filter((p) => p._id !== _id));
  }

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const quantidadeTotal = produtos.reduce(
        (acc, p) => acc + (p.itens?.length || 0),
        0,
      );

      const payload = {
        codigo: formValue.codigo,
        valor_total: valorTotalHook.value,
        data: formValue.data,
        data_vencimento: formValue.data_vencimento,
        fornecedor: formValue.fornecedor,
        quantidade: incluirProdutos ? quantidadeTotal : formValue.quantidade,
        itens: incluirProdutos ? produtos : []
      };

      const response = await handleRequest(() => API.postNota(payload));

      if (response?.ok) {
        const data = response.data || response;
        if (data.produtos) {
          let itensCriadosData = [];
          for (const res of data.produtos) {
            if (res.itensEstoque) {
              itensCriadosData = itensCriadosData.concat(res.itensEstoque);
            }
          }
          setItensCriados(itensCriadosData);
          setModalCriar(true);
        } else if (onSuccess) {
          onSuccess();
        }
      }
    }
  };
  
  return {
    formValue,
    erros,
    validated: !!Object.keys(erros).length,
    incluirProdutos,
    setIncluirProdutos,
    itemEstoque,
    setItemEstoque,
    produtos,
    modalCadastroPrduto,
    setmodalCadastroPrduto,
    modalInfoProduto,
    setmodalInfoProduto,
    modalCriar,
    setModalCriar,
    itensCriados,
    isLoading,
    valorTotalHook,
    cadastrarProduto,
    removerProduto,
    handleChange,
    handleSubimit,
    setFormValue,
  };
}
