import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useCadastroProduto } from "@hooks/produtos/useCadastroProduto";
import { Cores } from "@components/Cores";
import { useEffect } from "react";

function CadastroIntenModal({
  visible,
  onClose,
  cadastrarProduto,
  cadastroNota = false,
}) {
  const {
    cores,
    notas,
    categorias,
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
    handleSubimit,
    validate,
    gerarFormData,
  } = useCadastroProduto((itens) => {
    if (cadastroNota && itens) {
      // No modo nota, apenas repassamos os itens para a nota pai
      // O hook já faz o loop, mas aqui o modal original tinha uma lógica de cadastrarProduto(FormData)
      // que vinha por props. Vamos manter a compatibilidade se necessário.
    }
  });

  // Sincronização de props especiais (como cadastrarProduto manual da Nota)
  // No modal original de Nota, o cadastrarProduto apenas adicionava ao array local da Nota.
  // Vamos interceptar o submit se for cadastroNota
  const finalHandleSubmit = async (e) => {
    if (cadastroNota) {
      e.preventDefault();
      // Usamos o validate e gerarFormData do hook para garantir consistência
      if (validate()) {
        const formData = gerarFormData();
        if (cadastrarProduto) {
          cadastrarProduto(formData);
        }
        onClose();
      }
    } else {
      handleSubimit(e);
    }
  };

  useEffect(() => {
    if (!visible) {
      setFormValue({ quantidade: 1 });
      setValidated(false);
      setErros({});
    }
  }, [visible, setFormValue, setValidated, setErros]);

  if (!visible) return null;

  function NotaItems({ notas, handleChange }) {
    return (
      <>
        {notas.map((n) => (
          <Dropdown.Item
            key={n.id}
            onClick={() => handleChange("nota_id", n.id)}
          >
            {n.codigo}
          </Dropdown.Item>
        ))}
      </>
    );
  }

  function CategoriaItems({ categorias, handleChange }) {
    return (
      <>
        {categorias.map((c) => (
          <Dropdown.Item
            key={c.id}
            onClick={() => handleChange("categoria_id", c.id)}
          >
            {c.nome}
          </Dropdown.Item>
        ))}
      </>
    );
  }

  return (
    <>
      <Modal
        show={visible && !modalCriar}
        onHide={onClose}
        size="xl"
        centered
        fullscreen="md-down"
        animation
      >
        <Form onSubmit={finalHandleSubmit} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  value={formValue.nome || ""}
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
              <Col
                xs={2}
                md={1}
                className="d-flex flex-column align-items-center"
              >
                <Form.Label htmlFor="corProduto">Cor</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="none"
                    className={`dropdown-toggle-none w-100 d-flex justify-content-center align-items-center border-0 p-0 ${
                      validated ? (erros.cor ? "is-invalid" : "is-valid") : ""
                    }`}
                  >
                    <div className="d-flex flex-column align-items-center gap-1">
                      <div
                        style={{
                          backgroundColor: formValue.cor || "transparent",
                          width: "2.3rem",
                          height: "2.3rem",
                          borderRadius: "50%",
                          // border: '1px solid #aaaaaa',
                          boxShadow: "0 0 0 1px #666666",
                        }}
                      />
                      {/* <span className="fw-normal text-[0.7rem]">
                        {cores.find(c => c.hex === formValue.cor)?.name || "Selecione a Cor"}
                      </span> */}
                    </div>
                  </Dropdown.Toggle>
                  <Form.Control
                    id="corProduto"
                    type="hidden"
                    name="cor"
                    value={formValue.cor || ""}
                    required
                  />
                  <Dropdown.Menu
                    className="p-0 shadow-sm"
                    style={{ width: "320px" }}
                  >
                    <Cores
                      cores={cores}
                      formValue={formValue}
                      handleChange={handleChange}
                    />
                    <Dropdown.Divider className="m-0" />
                    {/* Nota: lembre-se de importar o setModalCores no topo do seu arquivo do hook */}
                    {/* <Dropdown.Item onClick={() => { if(typeof setModalCores !== 'undefined') setModalCores(true) }} className="text-center py-2 fw-bold text-primary">
                      + Nova Cor
                    </Dropdown.Item> */}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={12} md={3}>
                <Form.Label htmlFor="categoriaProduto">Categoria</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="none"
                    className={`form-select w-100 d-flex justify-content-between align-items-center bg-white dropdown-toggle-none ${
                      validated
                        ? erros.categoria_id
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                  >
                    {categorias.find((c) => c.id === formValue.categoria_id)
                      ?.nome || "Selecione a Categoria"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <CategoriaItems
                      categorias={categorias}
                      handleChange={handleChange}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => setModalCadastroCategoia(true)}
                    >
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
                  value={formValue.marca || ""}
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
                  value={formValue.tamanho || ""}
                  onChange={handleChange}
                  placeholder="Tamanho"
                  required
                />
              </Col>
            </Row>

            <Row className="g-3 mb-3 pb-4 border-bottom">
              {!cadastroNota && (
                <Col xs={12} md={4}>
                  <Form.Label htmlFor="notaProduto">Nota</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="none"
                      className={`form-select w-100 d-flex justify-content-between align-items-center bg-white dropdown-toggle-none ${
                        validated
                          ? erros.nota_id
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                    >
                      {notas.find((n) => n.id === formValue.nota_id)?.codigo ||
                        "Selecione a Nota"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <NotaItems notas={notas} handleChange={handleChange} />
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              )}

              <Col xs={10} md={!cadastroNota ? 6 : 9}>
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
                  value={formValue.codigo_barras || ""}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col xs={2} md={!cadastroNota ? 2 : 3}>
                <Form.Label htmlFor="quantidadeProduto">Qtd.</Form.Label>
                <Form.Control
                  name="quantidade"
                  id="quantidadeProduto"
                  type="text"
                  placeholder="1"
                  value={formValue.quantidade || 1}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col xs={4} md={4}>
                <Form.Label htmlFor="valorCompraProduto">
                  Vlr. Compra
                </Form.Label>
                <InputGroup
                  className={`overflow-hidden ${validated ? (erros.valor_compra ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}
                >
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    R$
                  </InputGroup.Text>
                  <Form.Control
                    className={`border-0 shadow-none ${validated ? (erros.valor_compra ? "is-invalid" : "is-valid") : ""}`}
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
                <InputGroup
                  className={`overflow-hidden ${validated ? (erros.valor_venda ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}
                >
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    R$
                  </InputGroup.Text>
                  <Form.Control
                    className={`border-0 shadow-none ${validated ? (erros.valor_venda ? "is-invalid" : "is-valid") : ""}`}
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
                <InputGroup
                  className={`overflow-hidden ${validated ? (erros.lucro ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}
                >
                  <InputGroup.Text className="bg-transparent border-0 text-muted">
                    R$
                  </InputGroup.Text>
                  <Form.Control
                    className={`border-0 shadow-none ${validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""}`}
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
                    validated
                      ? erros.descricao
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }
                  name="descricao"
                  as="textarea"
                  rows={4}
                  style={{ resize: "none" }}
                  id="descricaoProduto"
                  placeholder="Descrição do produto"
                  value={formValue.descricao}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-roxo w-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <CadastroCategoria
        visible={modalCadastroCategoria}
        onClose={() => setModalCadastroCategoia(false)}
      />

      <ProdutosCriados
        visible={modalCriar}
        onClose={() => {
          setModalCriar(false);
          onClose();
        }}
        itens={itensCriados}
      />
    </>
  );
}

export default CadastroIntenModal;
