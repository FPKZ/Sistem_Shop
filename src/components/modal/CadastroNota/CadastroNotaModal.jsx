import { Modal, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import TabelaProdutosNota from "./include/TabelaProdutosNota";
import CadastroIntenModal from "@components/modal/CadastroProdutos/CadastroIntenModal";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import ProdutoInfo from "@components/modal/InfoProdutos/InfoProdutos";
import API from "@app/api";
import { useToast } from "@contexts/ToastContext";
import { useOutletContext } from "react-router-dom";

export default function CadastroNotaModal({ visible, onClose }) {
  const [formValue, setFormValue] = useState({});
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);
  const [incluirProdutos, setIncluirProdutos] = useState(false);

  const { mobile } = useOutletContext();

  const [itemEstoque, setItemEstoque] = useState({});
  const [produtos, setProdutos] = useState([]);

  const [modalCadastroPrduto, setmodalCadastroPrduto] = useState(false);
  const [modalInfoProduto, setmodalInfoProduto] = useState(false);
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState(null);

  const { showToast } = useToast();

  // Update formValue.quantidade when produtos changes IF incluirProdutos is true
  useEffect(() => {
    if (incluirProdutos) {
      setFormValue((prev) => ({ ...prev, quantidade: produtos.length }));
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
    // Generate a unique ID for the frontend list
    obj.frontId = `prod_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    setProdutos((prev) => prev.concat(obj));
  }

  function handleChange(e) {
    const { name, value } = e.target;
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
      finalFormData.append("valor_total", formValue.valor_total);
      finalFormData.append("data", formValue.data);
      finalFormData.append("data_vencimento", formValue.data_vencimento);
      finalFormData.append("fornecedor", formValue.fornecedor);

      // Se incluirProdutos for true, usa o length do array. Se false, usa o valor do input.
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

      // console.log("Dados a serem enviados:", Object.fromEntries(finalFormData));
      const response = await API.postNota(finalFormData);

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
          // Se não houver produtos criados (ex: nota sem produtos), apenas fecha ou limpa
          onClose();
        }
      }
    }
  };

  return (
    <>
      <Modal
        show={visible}
        onHide={onClose}
        fullscreen={mobile ? true : "md-down"} // Fullscreen no mobile
        size="xl"
        centered
        contentClassName={`${
          mobile ? "h-100" : produtos.length > 0 ? "h-75" : "h-0"
        }`} // Altura total para permitir flex
        dialogClassName={`${
          mobile ? "h-100" : produtos.length > 0 ? "h-75" : "h-0"
        }`} // Altura total para o dialog
      >
        <Form
          onSubmit={handleSubimit}
          noValidate
          className="d-flex flex-column h-100"
        >
          <Modal.Header closeButton className="flex-shrink-0">
            <Modal.Title>Cadastrar Nota</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column overflow-hidden">
            <div className="flex-shrink-0">
              <Row className="g-3">
                {/* Linha 1: Numero, Data, Vencimento */}
                <Col xs={12} md={8}>
                  <label htmlFor="numeroNota" className="form-label">
                    Numero da Nota
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated
                        ? erros.codigo
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="codigo"
                    id="numeroNota"
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <label htmlFor="data" className="form-label">
                    Data
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
                      validated
                        ? erros.fornecedor
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="fornecedor"
                    id="fornecedor"
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col xs={6} md={3}>
                  <label htmlFor="valor_total" className="form-label">
                    Valor Total
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      validated
                        ? erros.valor_total
                          ? `is-invalid`
                          : `is-valid`
                        : ""
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
                    value={formValue.quantidade || ""}
                    onChange={handleChange}
                    readOnly={incluirProdutos}
                    required
                  />
                </Col>

                {/* Toggle Incluir Produtos */}
                <Col xs={12} className="d-flex align-items-center gap-2 mt-2">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Incluir Produtos na Nota"
                    checked={incluirProdutos}
                    onChange={(e) => setIncluirProdutos(e.target.checked)}
                  />
                </Col>
              </Row>
            </div>

            {incluirProdutos && (
              <div className="d-flex flex-column flex-grow-1 overflow-hidden mt-3 border rounded">
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

            <div className="mt-3 flex-shrink-0">
              <button
                className="btn btn-roxo w-100"
                disabled={modalCadastroPrduto}
                type="submit"
              >
                Salvar Nota
              </button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
      <CadastroIntenModal
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
    </>
  );
}
