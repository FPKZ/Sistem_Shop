import { useState, useEffect, useCallback } from "react";
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modalImagens, setModalImagens] = useState(false);
  const [activeTabModalImagens, setActiveTabModalImagens] = useState("galeria");

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
      imgs: [],
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
  const imageUpload = useImageUpload(async (file) => {
    if (file) {
      setIsUploadingImage(true);
      try {
        // Fazemos o upload de forma "silenciosa" (sem usar o handleRequest para não disparar o loading global)
        const response = await API.postImagens([file]);
        if (response?.ok && response.data) {
          setFormValue((prev) => ({
            ...prev,
            imgs: [...(prev.imgs || []), ...(response.data || [])],
          }));
        }
      } catch (error) {
        console.error("Erro no upload silencioso de imagem:", error);
      } finally {
        setIsUploadingImage(false);
      }
    }
  });

  const removeImagem = async (url) => {
    const response = await handleRequest(() => API.deleteImagem(url));
    if (response?.ok) {
      setFormValue((prev) => ({
        ...prev,
        imgs: prev.imgs.filter((img) => img !== url),
      }));
    }
  };

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

  const resetForm = useCallback(() => {
    setFormValue({
      nome: "",
      imgs: [],
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
    setActiveTabModalImagens("galeria");
  }, [setFormValue, setValidated, setErros, pricing.handlers, imageUpload.handlers]);

  // Reset automático quando o modal de sucesso fecha ou o fluxo reinicia
  useEffect(() => {
    if (modalCriar) {
      resetForm();
    }
  }, [modalCriar]); // Simplificado pois resetForm é estável ou as dependências internas já são tratadas

  const gerarPayloadData = () => {
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

    return {
      nome: formValue.nome,
      descricao: formValue.descricao,
      imgs: formValue.imgs,
      categoria_id: formValue.categoria_id,
      itens: itens,
    };
  };

  async function handleSubimit(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (isUploadingImage) {
      // Opcional: mostrar um alerta ou simplesmente bloquear
      return;
    }

    if (validate()) {
      const payload = gerarPayloadData();

      const response = await handleRequest(() => API.postProduto(payload));

      if (response?.ok) {
        const data = response.data || response;
        if (data.itensEstoque) {
          const dadosItens = Array.isArray(data.itensEstoque)
            ? data.itensEstoque
            : [data.itensEstoque];
          setItensCriados(dadosItens);
          setModalCriar(true);
        }
        if (onSuccess) onSuccess(data.itensEstoque);
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
    isLoading: isLoading || isUploadingImage,
    isUploadingImage,
    
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
    modalImagens,
    setModalImagens,
    activeTabModalImagens,
    setActiveTabModalImagens,
    removeImagem,
    
    // Handlers
    handleChange,
    handleSubimit,
    validate,
    gerarPayloadData,
    resetForm,
    setFormValue,
    setValidated,
    setErros,
  };
}

