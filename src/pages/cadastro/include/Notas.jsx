import {
  Modal,
  Row,
  Col,
  Button,
  Card,
  Form,
  Alert,
  Container,
  Table,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import TabelaProdutosNota from "@components/modal/CadastroNota/include/TabelaProdutosNota";
import CadastroModal from "@components/modal/CadastroProdutos/CadastroIntenModal";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import ProdutoInfo from "@components/modal/InfoProdutos/InfoProdutos";
import API from "@app/api";

import { useOutletContext } from "react-router-dom";

import { useToast } from "@contexts/ToastContext";

export default function Notas() {
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

  const { mobile } = useOutletContext();

  const { showToast } = useToast();

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
        // Lidar com o erro, caso a string não seja um JSON válido
      }
    }
    obj.img = imgFile;
    obj.frontId = `prod_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`; // ID único

    // console.log(obj)
    const p = produtos.concat(obj);
    setProdutos(p);
    setmodalCadastroPrduto(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
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

  function FormatData(data) {
    const formData = new FormData(data);
    const dataf = Object.fromEntries(formData.entries());
    return dataf;
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
      finalFormData.append("valor_total", formValue.valor_total);
      finalFormData.append("data", formValue.data);
      finalFormData.append("data_vencimento", formValue.data_vencimento);
      finalFormData.append("fornecedor", formValue.fornecedor);

      finalFormData.append(
        "quantidade",
        incluirProdutos ? produtos.length : formValue.quantidade
      );

      if (incluirProdutos && produtos.length > 0) {
        // Prepara os produtos para serem enviados
        const produtosParaEnviar = produtos.map((p) => {
          // Retorna uma cópia do produto sem o arquivo de imagem,
          // pois a imagem será enviada separadamente.

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
      // Aqui você faria a chamada para a API para cadastrar a nota
      const response = await API.postNota(finalFormData);
      // const response = ObjectText
      if (response.ok) {
        if (response.produtos) {
          let itensCriados = [];
          for (const itens of response.produtos) {
            itensCriados = itensCriados.concat(itens.itensEstoque);
          }
          setItensCriados(itensCriados);
          setModalCriar(true);
          showToast(response.message, "success");
        } else {
          if (response.message) {
            showToast(response.message, "error");
          }
        }
      }
      // console.log(response)
    }
  };
  //  console.log(produtos)
  //  console.log(Object.fromEntries(produtos))
  // console.log(itemEstoque)
  // console.log(modalInfoProduto)
  return (
    <div className="row-col w-100 p-3 pt-0 m-0 p-md-3 d-flex gap-4 justify-content-center">
      <form
        onSubmit={handleSubimit}
        noValidate
        className="row d-flex flex-wrap w-100 gap-3"
      >
        <div className="col-sm col-md-12 p-0">
          <label htmlFor="numeroNota" className="form-label">
            Numero da Nota
          </label>
          <input
            type="text"
            className={`form-control ${
              validated ? (erros.codigo ? `is-invalid` : `is-valid`) : ""
            }`}
            name="codigo"
            id="numeroNota"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm col-md-2 p-0">
          <label htmlFor="valor_total" className="form-label">
            Valor da Nota
          </label>
          <input
            type="number"
            className={`form-control ${
              validated ? (erros.valor_total ? `is-invalid` : `is-valid`) : ""
            }`}
            name="valor_total"
            id="valor_total"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm col-md-2 p-0">
          <label htmlFor="data" className="form-label">
            Data da nota
          </label>
          <input
            type="date"
            className={`form-control ${
              validated ? (erros.data ? `is-invalid` : `is-valid`) : ""
            }`}
            name="data"
            id="data"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm col-md-2 p-0">
          <label htmlFor="data_vencimento" className="form-label">
            Vencimento
          </label>
          <input
            type="date"
            className={`form-control ${
              validated
                ? erros.data_vencimento
                  ? `is-invalid`
                  : `is-valid`
                : ""
            }`}
            name="data_vencimento"
            id="data_vencimento"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm col-md p-0">
          <label htmlFor="fornecedor" className="form-label">
            Fornecedor
          </label>
          <input
            type="text"
            className={`form-control ${
              validated ? (erros.fornecedor ? `is-invalid` : `is-valid`) : ""
            }`}
            name="fornecedor"
            id="fornecedor"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-sm col-md-3 p-0">
          <label htmlFor="quantidade" className="form-label">
            Quantidade de produtos da nota
          </label>
          <input
            type="number"
            className={`form-control ${
              validated ? (erros.quantidade ? `is-invalid` : `is-valid`) : ""
            }`}
            name="quantidade"
            id="quantidade"
            value={
              formValue.quantidade || (incluirProdutos ? produtos.length : "")
            }
            onChange={handleChange}
            readOnly={incluirProdutos}
            required
          />
        </div>

        <div className="col-12 d-flex align-items-center gap-2 mt-2">
          <Form.Check
            type="switch"
            id="custom-switch-page"
            label="Incluir Produtos na Nota"
            checked={incluirProdutos}
            onChange={(e) => setIncluirProdutos(e.target.checked)}
          />
        </div>

        {incluirProdutos && (
          <div
            className="col-12 form-control d-flex flex-column mt-2 p-0"
            style={{ height: "400px" }}
          >
            <div className="col-12 d-flex justify-content-between p-2 border-bottom">
              <p className="align-content-center m-0">Produtos</p>
              <button
                className="btn btn-light"
                type="button"
                onClick={() => setmodalCadastroPrduto(true)}
              >
                Adicionar Produto
              </button>
            </div>
            <div className="col-12 d-flex flex-column gap-2 overflow-y-auto flex-grow-1">
              <TabelaProdutosNota
                mobile={mobile}
                produto={produtos}
                setItemEstoque={setItemEstoque}
                setmodalInfoProduto={setmodalInfoProduto}
              />
            </div>
          </div>
        )}

        <button className="btn btn-roxo" type="submit">
          Adicionar
        </button>
      </form>
      <CadastroModal
        visible={modalCadastroPrduto}
        onClose={() => setmodalCadastroPrduto(false)}
        cadastroNota={true}
        cadastrarProduto={cadastrarProduto}
      />
      <ProdutoInfo
        visible={modalInfoProduto}
        onClose={() => setmodalInfoProduto(false)}
        tableShow={false}
        produto={itemEstoque}
      />
      <ProdutosCriados
        visible={modalCriar}
        onClose={() => setModalCriar(false)}
        itens={itensCriados}
      />
    </div>
  );
}
