import { Row, Col, Form, Button, Dropdown, InputGroup } from "react-bootstrap";
import CadastrarNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useCadastroProduto } from "@hooks/produtos/useCadastroProduto";

export default function Produtos() {
  const {
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
  } = useCadastroProduto();

  return (
    <div className="w-100 p-3 pt-0 m-0">
      <Form onSubmit={handleSubimit} noValidate>
        {/* === Bloco de Detalhes Básicos === */}
        <Row className="g-3 mb-3 pb-4 border-bottom">
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

          <Col xs={10} md={4}>
            <Form.Label htmlFor="imgProduto">Imagem</Form.Label>
            <Form.Control
              name="img"
              id="imgProduto"
              type="file"
              onChange={handleChange}
            />
          </Col>

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

          <Col xs={6} md={2}>
            <Form.Label htmlFor="tamanhoProduto">Tamanho</Form.Label>
            <Form.Control
              className={
                validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""
              }
              name="tamanho"
              id="tamanhoProduto"
              type="text"
              value={formValue.tamanho}
              onChange={handleChange}
              placeholder="Tamanho"
              required
            />
          </Col>
        </Row>

        {/* === Bloco de Finanças e Vínculo de Estoque === */}
        <Row className="g-3 mb-3 pb-4 border-bottom">
          <Col xs={12} md={4}>
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

          <Col xs={2} md={2}>
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

          <Col xs={4} md={4}>
            <Form.Label htmlFor="valorCompraProduto">Vlr. Compra</Form.Label>
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
                type="text"
                placeholder="R$ 0,00"
                value={valorCompraHook.displayValue}
                onChange={handleValorCompraChange}
                required
              />
            </InputGroup>
          </Col>

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
                type="text"
                placeholder="R$ 0,00"
                value={valorVendaHook.displayValue}
                onChange={handleValorVendaChange}
                required
              />
            </InputGroup>
          </Col>

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
                type="text"
                placeholder="R$ 0,00"
                value={lucroHook.displayValue}
                onChange={handleLucroChange}
                required
              />
            </InputGroup>
          </Col>
        </Row>

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

        <Row>
          <Col xs={12}>
            <Button
              variant="outline-secondary"
              className="btn-roxo w-100"
              disabled={isLoading}
              type="submit"
            >
              Cadastrar
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
