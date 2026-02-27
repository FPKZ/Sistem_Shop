import { useState, useEffect } from "react";
import API from "@app/api";
import { useToast } from "@contexts/ToastContext";
import { useLoadRequest } from "@hooks/useLoadRequest";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroProduto() {
  const [categoria, setCategoria] = useState({});
  const [nota, setNota] = useState({});
  const [notas, setNotas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);

  const [modalCriar, setModalCriar] = useState(false);

  const [itensCriados, setItensCriados] = useState([]);

  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);
  const [formValue, setFormValue] = useState({
    nome: "",
    img: null,
    cor: "#000000",
    marca: "",
    tamanho: "",
    codigo_barras: "",
    descricao: "",
    quantidade: 1,
  });

  const valorCompraHook = useCurrencyInput({ initialValue: 0 });
  const valorVendaHook = useCurrencyInput({ initialValue: 0 });
  const lucroHook = useCurrencyInput({ initialValue: 0 });

  const { showToast } = useToast();
  const [isLoading, request] = useLoadRequest();

  function handleChange(e) {
    const { name, value, type, files } = e.target;

    if (name === "valor_compra" || name === "valor_venda" || name === "lucro") {
      return;
    }

    setFormValue((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

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

  function validate(form) {
    let newErrors = {};

    const elements = form.querySelectorAll("[name]");

    elements.forEach((e) => {
      const { name, value, required, type } = e;

      if (required && !value.trim()) {
        newErrors[name] = "Campo obrigatório!";
      }

      if (type == "number" && value && isNaN(value)) {
        newErrors[name] = "Digite um valor numerico valido";
      }
    });
    return newErrors;
  }

  async function handleSubimit(e) {
    e.preventDefault();
    const form = e.target;

    const newErrors = validate(form);
    setErros(newErrors);
    setValidated(true);

    if (Object.keys(newErrors).length === 0) {
      const quantidade = parseInt(formValue.quantidade) || 1;
      let allItensCriados = [];

      for (let i = 0; i < quantidade; i++) {
        const finalFormData = new FormData();

        finalFormData.append("nome", formValue.nome);
        finalFormData.append("descricao", formValue.descricao);
        finalFormData.append("img", formValue.img);
        finalFormData.append("categoria_id", categoria.id || "");

        const itens = [
          {
            codigo_barras: formValue.codigo_barras,
            nota_id: nota.id || "",
            tamanho: formValue.tamanho,
            cor: formValue.cor,
            marca: formValue.marca,
            valor_compra: valorCompraHook.value,
            valor_venda: valorVendaHook.value,
            lucro: lucroHook.value,
          },
        ];

        finalFormData.set("itens", JSON.stringify(itens));

        await request(async () => {
          try {
            const response = await API.postProduto(finalFormData);

            if (response.ok) {
              if (response.itensEstoque) {
                allItensCriados = allItensCriados.concat(response.itensEstoque);
              }
            } else {
              if (response.message) {
                showToast(response.message, "error");
              }
            }
          } catch (error) {
            console.log(error);
          }
        });
      }

      if (allItensCriados.length > 0) {
        showToast(
          `${allItensCriados.length} produtos criados com sucesso!`,
          "success",
        );
        setItensCriados(allItensCriados);
        setModalCriar(true);
      }
    }
  }

  useEffect(() => {
    GetNotas();
    GetCategorias();
  }, [modalCadastroCategoria, modalCadastroNota]);

  const GetCategorias = async () => {
    const categorias = await API.getCategoria();
    setCategorias(categorias);
  };
  const GetNotas = async () => {
    const notas = await API.getNotas();
    setNotas(notas);
  };

  return {
    categoria,
    setCategoria,
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
    validated,
    formValue,
    isLoading,
    valorCompraHook,
    valorVendaHook,
    lucroHook,
    handleChange,
    handleValorCompraChange,
    handleValorVendaChange,
    handleLucroChange,
    handleSubimit,
  };
}
