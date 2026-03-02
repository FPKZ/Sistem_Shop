import { Card, Button, Row, Col, Dropdown } from "react-bootstrap";
import utils from "@app/utils";

export function VendaCart({
  mobile,
  cliente,
  setShowModalCliente,
  listaVenda,
  setShowModalProduto,
  produtos,
  handleAlterarQuantidade,
  handleRemoverProduto,
}) {
  return (
    <>
      {/* Card Cliente */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Cliente</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModalCliente(true)}
          >
            <i className="bi bi-person-plus me-2"></i>
            {cliente ? "Alterar Cliente" : "Selecionar Cliente"}
          </Button>
        </Card.Header>
        {cliente && (
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <small className="text-muted">Nome</small>
                  <div className="fw-bold">{cliente.nome}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-2">
                  <small className="text-muted">Telefone</small>
                  <div>{cliente.telefone || "N/A"}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-2">
                  <small className="text-muted">Email</small>
                  <div className="small">{cliente.email || "N/A"}</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        )}
        {!cliente && (
          <Card.Body className="text-center py-4 text-muted">
            <i className="bi bi-person fs-1 d-block mb-2 opacity-25"></i>
            Nenhum cliente selecionado
          </Card.Body>
        )}
      </Card>

      {/* Card Produtos */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Produtos ({listaVenda.length})</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModalProduto(true)}
            disabled={!cliente}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Adicionar Produto
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {listaVenda.length > 0 ? (
            <div className="d-flex flex-column">
              {/* Header - Visível apenas em desktop */}
              <Row className="py-2 m-0 d-none d-md-flex border-bottom">
                <Col md={4} className="fw-semibold">
                  Produto
                </Col>
                <Col md={2} className="fw-semibold">
                  Preço Un.
                </Col>
                <Col md={3} className="fw-semibold text-center">
                  Quantidade
                </Col>
                <Col md={2} className="fw-semibold">
                  Subtotal
                </Col>
                <Col md={1} className="fw-semibold text-center m-0 p-0">
                  Ação
                </Col>
              </Row>

              {/* Lista de produtos */}
              {listaVenda.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-top ${
                    index % 2 === 0 ? "bg-white" : "bg-light bg-opacity-25"
                  }`}
                >
                  <Row className="py-2 px-1 m-0 align-items-center">
                    {/* Produto */}
                    <Col xs={10} md={4} className="mb-2 mb-md-0 order-first">
                      <div className="d-flex flex-column">
                        <span className="d-none text-muted small mb-1">
                          Produto
                        </span>
                        <div className="fw-bold">{item.nome}</div>
                        <small className="text-muted">{item.codigo}</small>
                      </div>
                    </Col>

                    {/* Preço Unitário */}
                    <Col xs={3} md={2} className="mb-0 order-3 order-md-2">
                      <div className="d-flex flex-column">
                        <span className="d-md-none text-muted small mb-1">
                          Preço Un.
                        </span>
                        <span className="text-success fw-bold">
                          {utils.formatMoney(
                            Math.max(
                              ...item.itens.map((i) => i.valor_venda),
                              0,
                            ),
                          )}
                        </span>
                      </div>
                    </Col>

                    {/* Quantidade */}
                    <Col
                      xs={3}
                      md={3}
                      className="mb-2 mb-md-0 order-2 order-md-3"
                    >
                      <div className="d-flex flex-column align-items-md-center w-100">
                        <span className="d-md-none text-muted small mb-1">
                          Quantidade
                        </span>
                        <div
                          className={`d-flex align-items-center gap-1 ${mobile ? "w-100" : "w-50"}`}
                        >
                          <Dropdown className="w-100">
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              className="w-100"
                            >
                              {item.quantidade}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu">
                              {Array.from(
                                {
                                  length:
                                    produtos.find((i) => i.id === item.id)
                                      ?.itemEstoque?.length || 0,
                                },
                                (_, i) => i + 1,
                              ).map((quantidade) => (
                                <Dropdown.Item
                                  className="text-center"
                                  key={quantidade}
                                  onClick={() =>
                                    handleAlterarQuantidade(item.id, quantidade)
                                  }
                                >
                                  {quantidade}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </Col>

                    {/* Subtotal */}
                    <Col
                      xs={6}
                      md={2}
                      className="m-0 text-end text-md-start order-4 order-md-4"
                    >
                      <div className="d-flex flex-column">
                        <span className="d-md-none text-muted small mb-1">
                          Subtotal
                        </span>
                        <span className="fw-bold">
                          {utils.formatMoney(
                            item.itens.reduce(
                              (total, i) => total + i.valor_venda,
                              0,
                            ),
                          )}
                        </span>
                      </div>
                    </Col>

                    {/* Ação */}
                    <Col
                      xs={2}
                      md={1}
                      className="flex justify-content-end justify-content-md-center order-1 order-md-last"
                    >
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleRemoverProduto(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-cart-x fs-1 d-block mb-2 opacity-25"></i>
              {cliente
                ? "Nenhum produto adicionado"
                : "Selecione um cliente para adicionar produtos"}
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
