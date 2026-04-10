import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useImageUpload from "@hooks/useImageUpload";
import useProductPricing from "@hooks/produtos/useProductPricing";

export function useCadastroProduto(onSuccess, caseNota = false) {
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState([]);

  // 1. Hook de Formulário Base
  const {
    formValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    validate,
    setFormValue,
  } = useForm(
    {
      nome: "",
      img: null,
      cor: null,
      categoria_id: null,
      marca: "",
      tamanho: "",
      nota_id: null,
      codigo_barras: "",
      quantidade: 1,
      valor_compra: null,
      valor_venda: null,
      lucro: null,
      descricao: "",
    },
    {
      validators: {
        nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        marca: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        tamanho: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        nota_id: (v) => (!caseNota ? (v == null ? "Campo obrigatório!" : null) : null),
        categoria_id: (v) => (v == null ? "Campo obrigatório!" : null),
        codigo_barras: (v) => (!v?.toString().trim() ? "Campo obrigatório!" : null),
        quantidade: (v) => (!v || v < 1 ? "Quantidade mínima é 1" : null),
        valor_compra: (v) => (!v?.toString().trim() ? "Campo obrigatório!" : null),
        valor_venda: (v) => (!v?.toString().trim() ? "Campo obrigatório!" : null),
        lucro: (v) => (!v?.toString().trim() ? "Campo obrigatório!" : null),
        descricao: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
      },
    },
  );

  // 2. Hook de Precificação (Lucro/Valores)
  const pricing = useProductPricing();
  const { valorCompra, valorVenda, lucro } = pricing;

  // 3. Hook de Imagem (Upload/Crop)
  const imageUpload = useImageUpload((file) => handleChange("img", file));

  const { isLoading, handleRequest } = useRequestHandler();

  // Sincronização automática dos valores decimais do hook de preço com o formValue
  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      valor_compra: valorCompra.value,
      valor_venda: valorVenda.value,
      lucro: lucro.value,
    }));
  }, [valorCompra.value, valorVenda.value, lucro.value, setFormValue]);

  // Reset total quando o modal de sucesso fecha ou o fluxo reinicia
  useEffect(() => {
    if (modalCriar) {
      setFormValue({
        nome: "",
        img: null,
        cor: null,
        categoria_id: null,
        marca: "",
        tamanho: "",
        nota_id: null,
        codigo_barras: "",
        quantidade: 1,
        valor_compra: null,
        valor_venda: null,
        lucro: null,
        descricao: "",
      });
      setValidated(false);
      setErros({});
      pricing.handlers.resetPricing();
      imageUpload.handlers.clearImage();
    }
  }, [modalCriar, setFormValue, setValidated, setErros, pricing.handlers, imageUpload.handlers]); // Adicionadas dependências para consistência

  const gerarFormData = () => {
    const finalFormData = new FormData();
    finalFormData.append("nome", formValue.nome);
    finalFormData.append("descricao", formValue.descricao);
    finalFormData.append("img", formValue.img);
    finalFormData.append("categoria_id", formValue.categoria_id || "");

    const quantidade = parseInt(formValue.quantidade) || 1;
    const itens = Array.from({ length: quantidade }, () => ({
      codigo_barras: formValue.codigo_barras,
      nota_id: formValue.nota_id || "",
      tamanho: formValue.tamanho,
      cor: formValue.cor,
      marca: formValue.marca,
      valor_compra: valorCompra.value,
      valor_venda: valorVenda.value,
      lucro: lucro.value,
    }));

    finalFormData.set("itens", JSON.stringify(itens));
    return finalFormData;
  };

  async function handleSubimit(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (validate()) {
      const finalFormData = gerarFormData();

      const response = await handleRequest(() => API.postProduto(finalFormData));

      if (response?.ok) {
        if (response.itensEstoque) {
          setItensCriados(response.itensEstoque);
          setModalCriar(true);
        }
        if (onSuccess) onSuccess(response.itensEstoque);
      }
    }
  }

  // Queries de Dados de Apoio (DropDowns)
  const { data: categoriasData } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await API.getCategoria();
      return res?.data || [];
    },
  });

  const { data: notasData } = useQuery({
    queryKey: ["notas"],
    queryFn: async () => {
      const res = await API.getNotas();
      return res || [];
    },
  });

  const { data: coresData } = useQuery({
    queryKey: ["cores"],
    queryFn: async () => {
      const res = await API.getCores();
      return res?.data || [];
    },
  });

  const categorias = categoriasData?.data || categoriasData || [];
  const notas = notasData || [];
  const cores = coresData?.data || coresData || [];

  return {
    // Dados
    cores,
    notas,
    categorias,
    itensCriados,
    formValue,
    erros,
    validated,
    isLoading,
    
    // Estados de UI
    modalCadastroNota,
    setModalCadastroNota,
    modalCadastroCategoria,
    setModalCadastroCategoia,
    modalCriar,
    setModalCriar,
    
    // Hooks Acoplados (Exposição direta para o componente visual)
    pricing,
    imageUpload,
    
    // Handlers
    handleChange,
    handleSubimit,
    validate,
    setFormValue,
    setValidated,
    setErros,
  };
}

