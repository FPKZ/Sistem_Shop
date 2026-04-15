import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@services";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useImageUpload from "@hooks/produtos/useImageUpload";
import useProductPricing from "@hooks/produtos/useProductPricing";

export function useCadastroProduto(onSuccess, caseNota = false) {
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoria] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [modalImagens, setModalImagens] = useState(false);
  const [activeTabModalImagens, setActiveTabModalImagens] = useState("galeria");
  const [isProdutoExistente, setIsProdutoExistente] = useState(false);

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

  // useRequestHandler deve vir antes de removeImagem, que usa handleRequest
  const { isLoading, handleRequest } = useRequestHandler();

  const removeImagem = useCallback(async (url) => {
    const response = await API.deleteImagem(url);
    if (response?.ok) {
      setFormValue((prev) => ({
        ...prev,
        imgs: prev.imgs.filter((img) => img !== url),
      }));
    }
  }, [setFormValue]);

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
    setIsProdutoExistente(false);
  }, [setFormValue, setValidated, setErros, pricing.handlers, imageUpload.handlers]);

  // Reset automático quando o modal de sucesso fecha ou o fluxo reinicia
  useEffect(() => {
    if (modalCriar) {
      resetForm();
    }
  }, [modalCriar, resetForm]); // Simplificado pois resetForm é estável ou as dependências internas já são tratadas

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

  const { data: produtosData } = API.getProdutos({itens: "none"})
  // console.log(produtosData)
  // Reverte unwrap condicional — certas versões cacheadas ou rotas
  // podem retornar objetos inteiros em vez de apenas a propriedade "data",
  // o que impede arrays de funcionarem com funções nativas como `.find()`
  const categorias = categoriasData?.data || categoriasData || [];
  const notas = notasData?.data || notasData || [];
  const cores = coresData?.data || coresData || [];
  const produtos = Array.isArray(produtosData?.data) ? produtosData.data : (Array.isArray(produtosData) ? produtosData : []);
  // console.log(produtos)
  const handleSelectProduto = useCallback((event, newValue) => {
    if (typeof newValue === 'string') {
      // FreeSolo text (digitou um nome que não está na lista)
      setFormValue((prev) => ({ ...prev, nome: newValue }));
      setIsProdutoExistente(false);
    } else if (newValue && newValue.id) {
      // Selecionou um produto existente
      setFormValue((prev) => ({
        ...prev,
        nome: newValue.nome,
        imgs: newValue.imgs || [],
        categoria_id: newValue.categoria_id,
        descricao: newValue.descricao || ""
      }));
      // Cor não vem no root do produto normalmente, mas se vier a gente seta, caso contrário manter neutra/null
      setIsProdutoExistente(true);
    } else {
      // Limpou o autocomplete
      setFormValue((prev) => ({ ...prev, nome: "" }));
      setIsProdutoExistente(false);
    }
  }, [setFormValue]);

  return {
    // Dados
    cores,
    notas,
    categorias,
    produtos,
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
    setModalCadastroCategoria,
    modalCriar,
    setModalCriar,
    isProdutoExistente,
    
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
    handleSelectProduto,
    handleSubimit,
    validate,
    gerarPayloadData,
    resetForm,
    setFormValue,
    setValidated,
    setErros,
  };
}

