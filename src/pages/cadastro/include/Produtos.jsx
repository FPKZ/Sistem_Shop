import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Dropdown, InputGroup } from "react-bootstrap";
import API from "@app/api";
import CadastrarNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useToast } from "@contexts/ToastContext";

export default function Produtos() {
  const [categoria, setCategoria] = useState({});
  const [nota, setNota] = useState({});
  const [notas, setNotas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalCadastroNota, setModalCadastroNota] = useState(false);
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);

  const [modalCriar, setModalCriar] = useState(false);

  const [itensCriados, setItensCriados] = useState(null);

  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);
  const [formValue, setFormValue] = useState({
    nome: "",
    img: null,
    cor: "#000000",
    marca: "",
    tamanho: "",
    codigo_barras: "",
    valor_compra: "",
    valor_venda: "",
    lucro: "",
    descricao: "",
    quantidade: 1,
  });

  const { showToast } = useToast();

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
            valor_compra: formValue.valor_compra,
            valor_venda: formValue.valor_venda,
            lucro: formValue.lucro,
          },
        ];

        finalFormData.set("itens", JSON.stringify(itens));

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
      }

      if (allItensCriados.length > 0) {
        showToast(
          `${allItensCriados.length} produtos criados com sucesso!`,
          "success"
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

  return (
    <div className="w-100 p-3 pt-0 m-0">
      <Form onSubmit={handleSubimit} noValidate>
        <Row className="g-3 mb-3 pb-4 border-bottom">
          {/* Nome */}
          <Col xs={12}>
            <Form.Label htmlFor="nomeProduto">Nome</Form.Label>
            <Form.Control
              className={
                validated ? (erros.nome ? "is-invalid" : "is-valid") : ""
              }
              name="nome"
              id="nomeProduto"
              type="text"
              placeholder="Nome do produto"
              value={formValue.nome}
              onChange={handleChange}
              required
            />
          </Col>

          {/* Imagem */}
          <Col xs={10} md={4}>
            <Form.Label htmlFor="imgProduto">Imagem</Form.Label>
            <Form.Control
              className={
                validated ? (erros.img ? "is-invalid" : "is-valid") : ""
              }
              name="img"
              id="imgProduto"
              type="file"
              onChange={handleChange}
              required
            />
          </Col>

          {/* Cor */}
          <Col xs={2} md={1} className="d-flex flex-column align-items-center">
            <Form.Label htmlFor="corProduto">Cor</Form.Label>
            <Form.Control
              className="form-control-color"
              name="cor"
              id="corProduto"
              type="color"
              value={formValue.cor}
              onChange={handleChange}
            />
          </Col>

          {/* Categoria */}
          <Col xs={12} md={3}>
            <Form.Label htmlFor="categoriaProduto">Categoria</Form.Label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className={`w-100 d-flex justify-content-between align-items-center ${
                  validated ? (erros.categoria ? "is-invalid" : "is-valid") : ""
                }`}
              >
                {categoria.nome || "Selecione a Categoria"}
              </Dropdown.Toggle>
              <Form.Control
                id="categoriaProduto"
                type="hidden"
                name="categoria"
                value={categoria.id || ""}
                required
              />
              <Dropdown.Menu className="w-100">
                <Categoria
                  categorias={categorias}
                  setCategoria={setCategoria}
                />
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setModalCadastroCategoia(true)}>
                  Nova Categoria
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          
          {/* Marca */}
          <Col xs={6} md={2}>
            <Form.Label htmlFor="marcaProduto">Marca</Form.Label>
            <Form.Control
              className={
                validated ? (erros.marca ? "is-invalid" : "is-valid") : ""
              }
              name="marca"
              id="marcaProduto"
              type="text"
              placeholder="Marca"
              value={formValue.marca}
              onChange={handleChange}
              required
            />
          </Col>

          {/* Tamanho */}
          <Col xs={6} md={2}>
            <Form.Label htmlFor="tamanhoProduto">Tamanho</Form.Label>
            <Form.Control
              className={
                validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""
              }
              name="tamanho"
              id="tamanhoProduto"
              type="number"
              value={formValue.tamanho}
              onChange={handleChange}
              placeholder="Tamanho"
              required
            />
          </Col>
        </Row>

        <Row className="g-3 mb-3 pb-4 border-bottom">
          {/* Nota */}
          <Col xs={12} md={5}>
            <Form.Label htmlFor="notaProduto">Nota</Form.Label>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className={`w-100 d-flex justify-content-between align-items-center ${
                  validated ? (erros.nota ? "is-invalid" : "is-valid") : ""
                }`}
              >
                {nota.codigo || "Selecione a Nota"}
              </Dropdown.Toggle>
              <Form.Control
                id="notaProduto"
                type="hidden"
                name="nota"
                value={nota.id || ""}
                required
              />
              <Dropdown.Menu className="w-100">
                <Nota notas={notas} setNota={setNota} />
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setModalCadastroNota(true)}>
                  Nova Nota
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          {/* Código de Barras */}
          <Col xs={10} md={6}>
            <Form.Label htmlFor="codigoBarras">Código de Barras</Form.Label>
            <Form.Control
              className={
                validated
                  ? erros.codigo_barras
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }
              name="codigo_barras"
              id="codigoBarras"
              type="number"
              placeholder="Código de Barras"
              value={formValue.codigo_barras}
              onChange={handleChange}
              required
            />
          </Col>

          {/* Quantidade */}
          <Col xs={2} md={1}>
            <Form.Label htmlFor="quantidadeProduto">Qtd.</Form.Label>
            <Form.Control
              name="quantidade"
              id="quantidadeProduto"
              type="number"
              placeholder="1"
              min="1"
              value={formValue.quantidade}
              onChange={handleChange}
              required
            />
          </Col>

          {/* Valor de Compra */}
          <Col xs={4} md={4}>
            <Form.Label htmlFor="valorCompraProduto">
              Vlr. Compra
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                className={
                  validated
                    ? erros.valor_compra
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
                name="valor_compra"
                id="valorCompraProduto"
                type="number"
                placeholder="0.00"
                value={formValue.valor_compra || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Col>

          {/* Valor de Venda */}
          <Col xs={4} md={4}>
            <Form.Label htmlFor="valorVendaProduto">Vlr. Venda</Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                className={
                  validated
                    ? erros.valor_venda
                      ? "is-invalid"
                      : "is-valid"
                    : ""
                }
                name="valor_venda"
                id="valorVendaProduto"
                type="number"
                placeholder="0.00"
                value={formValue.valor_venda || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Col>

          {/* Lucro */}
          <Col xs={4} md={4}>
            <Form.Label htmlFor="LucroProduto">Lucro</Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                className={
                  validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""
                }
                name="lucro"
                id="LucroProduto"
                type="number"
                placeholder="0.00"
                value={formValue.lucro || ""}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Descrição */}
        <Row className="g-3 mb-3">
          <Col xs={12}>
            <Form.Label htmlFor="descricaoProduto">Descrição</Form.Label>
            <Form.Control
              className={
                validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""
              }
              name="descricao"
              type="text"
              id="descricaoProduto"
              placeholder="Descrição"
              value={formValue.descricao}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        {/* Botão Salvar */}
        <Row>
          <Col xs={12}>
            <Button className="btn-roxo w-100" type="submit">
              Salvar
            </Button>
          </Col>
        </Row>
      </Form>

      <CadastrarNotaModal
        visible={modalCadastroNota}
        onClose={() => setModalCadastroNota(false)}
        produts={false}
      />
      <CadastroCategoria
        visible={modalCadastroCategoria}
        onClose={() => setModalCadastroCategoia(false)}
      />
      <ProdutosCriados
        visible={modalCriar}
        onClose={() => setModalCriar(false)}
        itens={itensCriados}
      />
    </div>
  );
}

function Nota({ notas, setNota }) {
  return (
    <>
      {notas.map((nota) => (
        <Dropdown.Item key={nota.id} onClick={() => setNota(nota)}>
          {nota.codigo}
        </Dropdown.Item>
      ))}
    </>
  );
}

function Categoria({ categorias, setCategoria }) {
  return (
    <>
      {categorias.map((categoria) => (
        <Dropdown.Item
          key={categoria.id}
          onClick={() => setCategoria(categoria)}
        >
          {categoria.nome}
        </Dropdown.Item>
      ))}
    </>
  );
}
