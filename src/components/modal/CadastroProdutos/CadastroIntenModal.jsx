// components/CadastroModal.jsx
import API from "@app/api";
import { useState, useEffect } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";

function CadastroModal({
  visible,
  onClose,
  cadastrarProduto,
  cadastroNota = false,
  mobile
}) {
  const [formValue, setFormValue] = useState({});
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);

  const [notas, setNotas] = useState([]);
  const [nota, setNota] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState({});

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setValidated(false);
        setErros({});
        setFormValue({});
      }, 200);
      return () => clearTimeout(timer);
    }

    !cadastroNota && GetNotas();
    GetCategorias();
  }, [visible]);

  const GetCategorias = async () => {
    const data = await API.getCategoria();
    //console.log(data)
    setCategorias(data);
  };
  const GetNotas = async () => {
    const data = await API.getNotas();
    //console.log(data)
    setNotas(data);
  };

  if (!visible) return null;
  //console.log(notas)

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    setFormValue((prev) => {
      const updatedValues = {
        ...prev,
        [name]: type === "file" ? files[0] : value,
      };

      const valorCompra = parseFloat(updatedValues.valor_compra) || 0;
      const lucro = parseFloat(updatedValues.lucro) || 0;
      const valorVenda = parseFloat(updatedValues.valor_venda) || 0;

      if (name === "valor_venda") {
        if (valorCompra > 0) {
          updatedValues.lucro = (valorVenda - valorCompra).toFixed(2);
        }
      } else if (name === "lucro") {
        if (valorCompra > 0) {
          updatedValues.valor_venda = (valorCompra + lucro).toFixed(2);
        }
      } else if (name === "valor_compra") {
        if (valorVenda > 0) {
          updatedValues.lucro = (valorVenda - valorCompra).toFixed(2);
        } else if (lucro > 0) {
          updatedValues.valor_venda = (valorCompra + lucro).toFixed(2);
        }
      }

      return updatedValues;
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

  function handleSubimit(e) {
    e.preventDefault();
    const form = e.target;

    const newErrors = validate(form);
    setErros(newErrors);
    setValidated(true);
    //console.log(erros)
    //console.log(validated)

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const data_refatorada = {
        nome: data.nome,
        descricao: data.descricao,
        img: "teste",
        categoria_id: data.categoria,
        itens: [
          {
            codigo_barras: data.codigo_barras,
            nota_id: data.nota,
            tamanho: data.tamanho,
            cor: data.cor,
            marca: data.marca,
            valor_compra: data.valor_compra,
            valor_venda: data.valor_venda,
            lucro: data.lucro,
          },
        ],
      };
      console.log(data_refatorada);
      cadastrarProduto(data_refatorada);
    }
  }

  return (
    <form onSubmit={handleSubimit} noValidate>
      <Modal
        show={visible}
        onHide={onClose}
        size="xxl"
        dialogClassName="modal-xxl"
        centered
        fullscreen="md-down"
        animation
      >
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-4 g-md-2 mb-3 pb-4 border-bottom">
            <Col xs={12} md={7}>
              <label htmlFor="nomeProduto" className="form-label">
                Nome
              </label>
              <input
                className={`form-control ${
                  validated ? (erros.nome ? "is-invalid" : "is-valid") : ""
                }`}
                name="nome"
                id="nomeProduto"
                type="text"
                placeholder="nome"
                value={formValue.nome}
                onChange={handleChange}
                required
              />
            </Col>
            <Col xs={10} md={5}>
              <label htmlFor="imgProduto" className="form-label">
                Imagem
              </label>
              <input
                className={`form-control ${
                  validated ? (erros.img ? "is-invalid" : "is-valid") : ""
                }`}
                name="img"
                id="imgProduto"
                type="file"
                onChange={handleChange}
                required
              />
            </Col>
            <Col xs={1} md={1}>
              <label htmlFor="corProduto" className="form-label">
                Cor
              </label>
              <input
                className="form-control form-control-color"
                name="cor"
                id="corProduto"
                type="color"
                placeholder="Cor"
                value={formValue.cor}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12} md={4}>
              <label htmlFor="marcaProduto" className="form-label">
                Marca
              </label>
              <input
                className={`form-control ${
                  validated ? (erros.marca ? "is-invalid" : "is-valid") : ""
                }`}
                name="marca"
                id="marcaProduto"
                type="text"
                placeholder="Marca"
                value={formValue.marca}
                onChange={handleChange}
                required
              />
            </Col>
            {categoria && (
              <Col xs={8} md={5} className="d-flex flex-column">
                <label htmlFor="categoriaProduto" className="form-label">
                  Categoria
                </label>
                <div className="btn-group">
                  <button
                    type="button"
                    className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${
                      validated
                        ? erros.categoria
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {categoria.nome || "Selecione a Categoria"}
                  </button>
                  <input
                    className={`form-control `}
                    id="categoriaProduto"
                    type="hidden"
                    name="categoria"
                    value={categoria.id || ""}
                    required
                  />
                  <ul className="dropdown-menu w-100">
                    <Categoria
                      categorias={categorias}
                      setCategoria={setCategoria}
                    />
                  </ul>
                </div>
              </Col>
            )}
            <Col mmd={1}>
              <label htmlFor="tamanhoProduto" className="form-label">
                Tamanho
              </label>
              <input
                className={`form-control ${
                  validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""
                }`}
                name="tamanho"
                id="tamanhoProduto"
                type="number"
                value={formValue.tamanho}
                onChange={handleChange}
                placeholder="Tamanho"
                required
              />
            </Col>
            {/* <div class="col-md-4">
                                        <label for="inputState" class="form-label">State</label>
                                        <select id="inputState" class="form-select">
                                        <option selected>Choose...</option>
                                        <option><hr></hr></option>
                                        <option>...</option>
                                        </select>
                                    </div> */}
          </Row>
          <Row className="g-2 m-0 pb-4 mb-3 border-bottom">
            {!cadastroNota && (
              <Col xs={12} md={5} className="d-flex flex-column">
                <label htmlFor="notaProduto" className="form-label">
                  Nota
                </label>
                <div className="dropdown-center">
                  <button
                    type="button"
                    className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${
                      validated ? (erros.nota ? "is-invalid" : "is-valid") : ""
                    }`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {nota.codigo || "Selecione a Nota"}
                  </button>
                  <input
                    className={`form-control ${
                      validated
                        ? erros.notaProduto
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    id="notaProduto"
                    type="hidden"
                    name="nota"
                    value={nota.id || ""}
                    onChange={handleChange}
                    required
                  />
                  <ul className="dropdown-menu w-100">
                    <Nota notas={notas} setNota={setNota} />
                  </ul>
                </div>
              </Col>
            )}
            <Col xs={8} md={!cadastroNota ? 5 : 10}>
              <label htmlFor="codigoBarras" className="form-label">
                Codigo de Barras
              </label>
              <input
                className={`form-control ${
                  validated
                    ? erros.codigo_barras
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
                name="codigo_barras"
                id="codigoBarras"
                type="text"
                placeholder="Codigo de Barras"
                value={formValue.codigo_barras}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <label htmlFor="entradaEstoqueProduto" className="form-label">
                Entrada
              </label>
              <input
                className={`form-control ${
                  validated
                    ? erros.entrada_estoque
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }`}
                name="entrada_estoque"
                id="entradaEstoqueProduto"
                type="number"
                placeholder="Quantidade"
                value={formValue.entrada_estoque}
                onChange={handleChange}
                required
              />
            </Col>
            <Col xs={4} md={4}>
              <label htmlFor="valorCompraProduto" className="form-label">
                Valor de Compra
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  className={`form-control ${
                    validated
                      ? erros.valor_compra
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  name="valor_compra"
                  id="valorCompraProduto"
                  type="number"
                  placeholder="0.00"
                  value={formValue.valor_compra || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </Col>
            <Col xs={4} md={4}>
              <label htmlFor="valorVendaProduto" className="form-label">
                Valor de Venda
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  className={`form-control ${
                    validated
                      ? erros.valor_venda
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  name="valor_venda"
                  id="valorVendaProduto"
                  type="number"
                  placeholder="0.00"
                  value={formValue.valor_venda || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </Col>
            <Col xs={4} md={4}>
              <label htmlFor="LucroProduto" className="form-label">
                Lucro
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  className={`form-control ${
                    validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""
                  }`}
                  name="lucro"
                  id="LucroProduto"
                  type="number"
                  placeholder="0.00"
                  value={formValue.lucro || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </Col>
          </Row>
          <Col md={12}>
            <label htmlFor="descricaoProduto" className="form-label">
              Descrição
            </label>
            <input
              className={`form-control ${
                validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""
              }`}
              name="descricao"
              type="text"
              id="descricaoProduto"
              placeholder="Descrição"
              value={formValue.descricao}
              onChange={handleChange}
              required
            />
          </Col>
          <Col className="pt-3 end-0">
            <Button className="btn btn-roxo w-100" type="submit">
              Salvar
            </Button>
          </Col>
        </Modal.Body>
      </Modal>
    </form>
  );
}

function Nota({ notas, setNota }) {
  return (
    <>
      {notas.map((nota) => (
        <li key={nota.id}>
          <a className="dropdown-item" onClick={() => setNota(nota)}>
            {nota.codigo}
          </a>
        </li>
      ))}
    </>
  );
}
function Categoria({ categorias, setCategoria }) {
  return (
    <>
      {categorias.map((categoria) => (
        <li key={categoria.id}>
          <a
            className="dropdown-item"
            onClick={() => setCategoria(categoria)}
          >
            {categoria.nome}
          </a>
        </li>
      ))}
    </>
  );
}

export default CadastroModal;
