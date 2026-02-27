import { useState, useEffect } from "react";
import API from "@app/api";
import { useToast } from "@contexts/ToastContext";
import { useLoadRequest } from "@hooks/useLoadRequest";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function useCadastroNota(navigate) {
  const [formValue, setFormValue] = useState({});
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);
  const [incluirProdutos, setIncluirProdutos] = useState(false);

  const [itemEstoque, setItemEstoque] = useState({});
  const [produtos, setProdutos] = useState([]);

  const [modalCadastroPrduto, setmodalCadastroPrduto] = useState(false);
  const [modalInfoProduto, setmodalInfoProduto] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);

  const [itensCriados, setItensCriados] = useState(null);

  const { showToast } = useToast();
  const [isLoading, request] = useLoadRequest();

  const valorTotalHook = useCurrencyInput({ initialValue: 0 });

  useEffect(() => {
    if (incluirProdutos) {
      setFormValue((prev) => ({
        ...prev,
        quantidade: produtos.length,
      }));
    }
  }, [produtos, incluirProdutos]);

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
    obj.frontId = `prod_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`; // ID único

    setProdutos((prev) => prev.concat(obj));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "valor_total") {
      return;
    }

    if (name === "categoria") console.log("1");
    setFormValue((prev) => {
      const updateValues = {
        ...prev,
        [name]: value,
      };
      return updateValues;
    });
  }

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

  const handleSubimit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newErrors = validate(form);
    setErros(newErrors);
    setValidated(true);

    if (Object.keys(newErrors).length === 0) {
      const finalFormData = new FormData();

      // Adiciona os campos da nota
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
        // Prepara os produtos para serem enviados
        const produtosParaEnviar = produtos.map((p) => {
          // eslint-disable-next-line no-unused-vars
          const { img, ...restoDoProduto } = p;
          return restoDoProduto;
        });

        // Anexa a lista de produtos (sem imagens) como uma string JSON
        finalFormData.append("itens", JSON.stringify(produtosParaEnviar));

        // Anexa cada imagem de produto individualmente
        produtos.forEach((produto) => {
          if (produto.img) {
            finalFormData.append(`imagem_${produto.frontId}`, produto.img);
          }
        });
      }

      console.log("Dados a serem enviados:", Object.fromEntries(finalFormData));
      await request(async () => {
        try {
          const response = await API.postNota(finalFormData);

          if (!response.ok) {
            showToast(response.message || response.error, "error");
            return;
          }

          if (response.ok) {
            if (response.produtos) {
              let itensCriadosData = [];
              for (const itens of response.produtos) {
                itensCriadosData = itensCriadosData.concat(itens.itensEstoque);
              }
              setItensCriados(itensCriadosData);
              setModalCriar(true);
              showToast(response.message || response.error, "success");
              navigate(-1);
            } else {
              if (response.message) {
                showToast(response.message || response.error, "success");
                navigate(-1);
              }
            }
          } else {
            showToast(response.message || response.error, "error");
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  };

  return {
    formValue,
    erros,
    validated,
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
