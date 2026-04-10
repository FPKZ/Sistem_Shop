import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroProduto(onSuccess, caseNota = false) {
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState([]);


  // Configuração do useForm para os campos básicos do produto
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

  const valorCompraHook = useCurrencyInput({ initialValue: 0 });
  const valorVendaHook = useCurrencyInput({ initialValue: 0 });
  const lucroHook = useCurrencyInput({ initialValue: 0 });

  const { isLoading, handleRequest } = useRequestHandler();

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      valor_compra: valorCompraHook.value,
      valor_venda: valorVendaHook.value,
      lucro: lucroHook.value,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorCompraHook.value, valorVendaHook.value, lucroHook.value]);

  useEffect(() => {
    if(modalCriar){
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
      })
      setValidated(false);
      setErros({});
      valorCompraHook.setValue(0);
      valorVendaHook.setValue(0);
      lucroHook.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalCriar]);

  // Handlers de precificação (lógica complexa mantida localmente para clareza)
  const handleValorCompraChange = (e) => {
    valorCompraHook.onChange(e);
    const newValorCompra =
      parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    if (valorVendaHook.value > 0) {
      lucroHook.setValue(valorVendaHook.value - newValorCompra);
    } else if (lucroHook.value > 0) {
      valorVendaHook.setValue(newValorCompra + lucroHook.value);
    }
  };

  const handleValorVendaChange = (e) => {
    valorVendaHook.onChange(e);
    const newValorVenda =
      parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    if (valorCompraHook.value > 0) {
      lucroHook.setValue(newValorVenda - valorCompraHook.value);
    }
  };

  const handleLucroChange = (e) => {
    lucroHook.onChange(e);
    const newLucro = parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    if (valorCompraHook.value > 0) {
      valorVendaHook.setValue(valorCompraHook.value + newLucro);
    }
  };

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
      valor_compra: valorCompraHook.value,
      valor_venda: valorVendaHook.value,
      lucro: lucroHook.value,
    }));

    finalFormData.set("itens", JSON.stringify(itens));
    return finalFormData;
  };

  async function handleSubimit(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (validate()) {
      const finalFormData = gerarFormData();

      const response = await handleRequest(() =>
        API.postProduto(finalFormData),
      );

      if (response?.ok) {
        if (response.itensEstoque) {
          setItensCriados(response.itensEstoque);
          setModalCriar(true);
        }
        if (onSuccess) onSuccess(response.itensEstoque);
      }
    }
  }

  // Integração com TanStack Query para os dropdowns da tela de cadastro
  const { data: categoriasData } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await API.getCategoria();
      return res?.data || [];
    }
  });

  const { data: notasData } = useQuery({
    queryKey: ["notas"],
    queryFn: async () => {
      const res = await API.getNotas();
      return res || [];
    }
  });

  const { data: coresData } = useQuery({
    queryKey: ["cores"],
    queryFn: async () => {
      const res = await API.getCores();
      return res?.data || [];
    }
  });

  const categorias = categoriasData?.data || categoriasData || [];
  const notas = notasData || [];
  const cores = coresData?.data || coresData || [];


  return {
    cores,
    notas,
    categorias,
    modalCadastroNota,
    setModalCadastroNota,
    modalCadastroCategoria,
    setModalCadastroCategoia,
    modalCriar,
    setModalCriar,
    itensCriados,
    erros,
    setErros,
    validated,
    setValidated,
    formValue,
    setFormValue,
    isLoading,
    valorCompraHook,
    valorVendaHook,
    lucroHook,
    handleChange,
    handleValorCompraChange,
    handleValorVendaChange,
    handleLucroChange,
    validate,
    gerarFormData,
    handleSubimit,
  };
}
