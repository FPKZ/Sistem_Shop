import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroProduto(onSuccess) {
  const [categoria, setCategoria] = useState({});
  const [nota, setNota] = useState({});
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);
  const [modalCores, setModalCores] = useState(false);
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
      cor: "#000000",
      marca: "",
      tamanho: "",
      codigo_barras: "",
      descricao: "",
      quantidade: 1,
    },
    {
      validators: {
        nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        quantidade: (v) => (!v || v < 1 ? "Quantidade mínima é 1" : null),
      },
    },
  );

  const valorCompraHook = useCurrencyInput({ initialValue: 0 });
  const valorVendaHook = useCurrencyInput({ initialValue: 0 });
  const lucroHook = useCurrencyInput({ initialValue: 0 });

  const { isLoading, handleRequest } = useRequestHandler();

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
    finalFormData.append("categoria_id", categoria.id || "");

    const quantidade = parseInt(formValue.quantidade) || 1;
    const itens = Array.from({ length: quantidade }, () => ({
      codigo_barras: formValue.codigo_barras,
      nota_id: nota.id || "",
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
    categoria,
    setCategoria,
    cores,
    setCores,
    nota,
    setNota,
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
