import { useState, useEffect } from "react";
import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroNota(navigate) {
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
      setFormValue((prev) => ({
        ...prev,
        quantidade: produtos.length,
      }));
    }
  }, [produtos, incluirProdutos, setFormValue]);

  function cadastrarProduto(data) {
    const obj = Object.fromEntries(data.entries());
    const imgFile = data.get("img");
    if (obj.itens && typeof obj.itens === "string") {
      try {
        obj.itens = JSON.parse(obj.itens);
      } catch (error) {
        console.error("Erro ao tentar parsear os itens:", error);
      }
    }
    obj.img = imgFile;
    obj.frontId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setProdutos((prev) => prev.concat(obj));
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
      finalFormData.append(
        "quantidade",
        incluirProdutos ? produtos.length : formValue.quantidade,
      );

      if (incluirProdutos && produtos.length > 0) {
        const produtosParaEnviar = produtos.map(({ img, ...resto }) => resto);
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
        navigate(-1);
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
  };
}
