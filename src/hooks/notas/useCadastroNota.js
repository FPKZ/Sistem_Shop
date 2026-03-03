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

  function cadastrarProduto(data) {
    const obj = Object.fromEntries(data.entries());
    const imgFile = data.get("img");
    let itemsArray = [];

    if (obj.itens && typeof obj.itens === "string") {
      try {
        itemsArray = JSON.parse(obj.itens);
      } catch (error) {
        console.error("Erro ao parsear itens:", error);
      }
    } else if (Array.isArray(obj.itens)) {
      itemsArray = obj.itens;
    }

    const novasEntradas = itemsArray.map((item, index) => ({
      ...obj,
      itens: [item],
      img: imgFile,
      frontId: `prod_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    setProdutos((prev) => prev.concat(novasEntradas));
  }

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const finalFormData = new FormData();
      finalFormData.append("codigo", formValue.codigo);
      finalFormData.append("valor_total", valorTotalHook.value);
      finalFormData.append("data", formValue.data);
      finalFormData.append("data_vencimento", formValue.data_vencimento);
      finalFormData.append("fornecedor", formValue.fornecedor);
      const quantidadeTotal = produtos.reduce(
        (acc, p) => acc + (p.itens?.length || 0),
        0,
      );
      finalFormData.append(
        "quantidade",
        incluirProdutos ? quantidadeTotal : formValue.quantidade,
      );

      if (incluirProdutos && produtos.length > 0) {
        const produtosParaEnviar = produtos.map(({ ...resto }) => resto);
        finalFormData.append("itens", JSON.stringify(produtosParaEnviar));
        produtos.forEach((p) => {
          if (p.img) finalFormData.append(`imagem_${p.frontId}`, p.img);
        });
      }

      const response = await handleRequest(() => API.postNota(finalFormData));

      if (response?.ok) {
        if (response.produtos) {
          let itensCriadosData = [];
          for (const itens of response.produtos) {
            itensCriadosData = itensCriadosData.concat(itens.itensEstoque);
          }
          setItensCriados(itensCriadosData);
          setModalCriar(true);
        }
        if (onSuccess) onSuccess();
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
    handleChange,
    handleSubimit,
    setFormValue,
  };
}
