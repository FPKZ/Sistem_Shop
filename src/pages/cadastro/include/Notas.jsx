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
    setProdutos((prev) => prev.concat(obj));
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
      } else {
        showToast(response.message, "error");
      }
      // console.log(response)
    }
  };
  //  console.log(produtos)
  //  console.log(Object.fromEntries(produtos))
  // console.log(itemEstoque)
  // console.log(modalInfoProduto)
  return (
    <div className="w-100 p-3">
      <Form onSubmit={handleSubimit} noValidate>
        <Row className="g-3">
          {/* Linha 1: Numero, Data, Vencimento */}
          <Col xs={12} md={8}>
            <label htmlFor="numeroNota" className="form-label">
              Numero da Nota
            </label>
            <input
              type="number"
              className={`form-control ${
                validated ? (erros.codigo ? `is-invalid` : `is-valid`) : ""
              }`}
              name="codigo"
              id="numeroNota"
              onChange={handleChange}
              required
            />
          </Col>
          <Col xs={6} md={2}>
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
          </Col>
          <Col xs={6} md={2}>
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
          </Col>

          {/* Linha 2: Fornecedor, Valor Total, Qnt */}
          <Col xs={12} md={6}>
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
          </Col>
          <Col xs={6} md={3}>
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
          </Col>
          <Col xs={6} md={3}>
            <label htmlFor="quantidade" className="form-label">
              Qnt. Produtos
            </label>
            <input
              type="number"
              className={`form-control ${
                validated && !incluirProdutos
                  ? erros.quantidade
                    ? `is-invalid`
                    : `is-valid`
                  : ""
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
          </Col>

          {/* Toggle Incluir Produtos */}
          <Col xs={12} className="d-flex align-items-center gap-2 mt-2">
            <Form.Check
              type="switch"
              id="custom-switch-page"
              label="Incluir Produtos na Nota"
              checked={incluirProdutos}
              onChange={(e) => setIncluirProdutos(e.target.checked)}
            />
          </Col>
        </Row>

        {incluirProdutos && (
          <div className="d-flex flex-column flex-grow-1 overflow-hidden mt-3 border rounded" style={{ height: "400px" }}>
            <div className="d-flex justify-content-between p-2 border-bottom bg-light flex-shrink-0">
              <p className="align-content-center m-0 fw-bold">
                Produtos da Nota
              </p>
              <button
                className="btn btn-sm btn-outline-primary"
                type="button"
                onClick={() => setmodalCadastroPrduto(true)}
              >
                + Adicionar Produto
              </button>
            </div>
            <div className="flex-grow-1 overflow-y-auto bg-white">
              {produtos.length > 0 ? (
                <TabelaProdutosNota
                  mobile={mobile}
                  produto={produtos}
                  setItemEstoque={setItemEstoque}
                  setmodalInfoProduto={setmodalInfoProduto}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-muted p-4">
                  Nenhum produto adicionado
                </div>
              )}
            </div>
          </div>
        )}

        <Button className="btn-roxo mt-3 w-100" type="submit">
          Adicionar
        </Button>
      </Form>
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
