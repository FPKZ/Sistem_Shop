import { useState, useEffect, useRef } from "react";
import util from "../../../app/utils.js"
import { Modal, Row, Col, Button, Card, Form, Alert, Container, Table, Badge, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText.js";
import TabelaProdutos from "../../../components/modal/Tabelas/TabelaProduto.jsx";


export default function ProdutoInfo({ visible, onClose, produto, mobile }) {
  const [itemEstoque, setItemEstoque] = useState({});

  const detailsRef = useRef(null)

  useEffect(() => {
    setItemEstoque({});
  }, [produto]);

  useEffect(() => {
    if(detailsRef.current){
      detailsRef.current.scrollTop = 0
    }
  }, [itemEstoque])
  
  if (!visible) return null;
  //console.log(produto)
  
  return (
    <Modal show={visible} onHide={onClose} size="xl" fullscreen="lg-down" dialogClassName="modal-xxl" animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes dos Produtos</Modal.Title>
      </Modal.Header>

      <Modal.Body ref={mobile ? detailsRef : null} style={{height: "80dvh", padding: 0}} className={mobile ? "overflow-auto" : "overflow-hidden"}>
        <Row className="h-100 g-0 p-0">
          {/* Lista de Produtos */}
          {/* <Col md={6} className={`order-md-1 order-2 m-0 p-0 d-flex flex-column border ${mobile ? "" : "h-100"}`}> */}
            {/* Cabeçalho Fixo */}
            {/* <Row className="g-0 p-2 m-0 border-bottom position-sticky top-0 bg-light" style={{zIndex: 1}}>
                <Col xs={1}><strong>Id</strong></Col>
                <Col xs={2}><strong>Img</strong></Col>
                <Col xs={3}><strong>Nome</strong></Col>
                <Col xs={2}><strong>Compra</strong></Col>
                <Col xs={2}><strong>Venda</strong></Col>
                <Col xs={2}><strong>Status</strong></Col>
            </Row> */}

            {/* Container dos Cards com Rolagem */}
            {/* <div className={`flex-grow-1 p-2 overflow-hidden ${mobile ? "" : "overflow-y-auto"}`}>
              <Produtos produtos={produto} setItemEstoque={setItemEstoque} />
            </div> */}
          {/* </Col> */}
          <TabelaProdutos mobile={mobile} produto={produto} setItemEstoque={setItemEstoque} width={6}/>

          {/* Detalhes */}
          <Col ref={mobile ? null : detailsRef} md={6} className={`order-md-2 order-1 p-0 ${mobile ? "" : "overflow-y-auto h-100"}`}>
            <Container fluid className={`d-flex flex-column ${mobile ? "" : "h-100"}`}>
              <div className="text-center mb-3 mt-2 border-bottom">
                <h3>{produto.nome}</h3>
              </div>

              <div className={`text-center mb-3 ${mobile ? "" : "h-25"}`}>
                <img
                  className="img-thumbnail h-100 rounded"
                  src={
                     "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"
                  }
                  style={mobile ? {maxHeight: "25dvh"}: {}}
                  alt={produto.nome}
                />
              </div>

              {!itemEstoque.id && (
                <Alert variant="warning">
                  Selecione um item de estoque para ver os detalhes.
                </Alert>
              )}

              {itemEstoque.id && (
                <Row className="g-3">
                  <Col md={12} xs={12}>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" value={itemEstoque.nome} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={6} xs={5}>
                    <Form.Group>
                      <Form.Label>Marca</Form.Label>
                      <Form.Control type="text" value={itemEstoque.marca} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4} xs={4}>
                    <Form.Group>
                      <Form.Label>Tamanho</Form.Label>
                      <Form.Control type="text" value={itemEstoque.tamanho} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={1} xs={1}>
                    <Form.Group>
                      <Form.Label>Cor</Form.Label>
                      <Form.Control
                        type="color"
                        value={itemEstoque.cor}
                        onChange={(e) =>
                          setItemEstoque({ ...itemEstoque, cor: e.target.value })
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control type="text" value={produto.descricao} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4} xs={4}>
                    <Form.Group>
                      <Form.Label>Preço de Venda</Form.Label>
                      <Form.Control
                        type="text"
                        className="text-end"
                        value={util.formatMoney(itemEstoque.valor_venda)}
                        disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4} xs={4}>
                    <Form.Group>
                      <Form.Label>Preço de Compra</Form.Label>
                      <Form.Control
                        type="text"
                        className="text-end"
                        value={util.formatMoney(itemEstoque.valor_compra)}
                        disabled />
                    </Form.Group>
                  </Col>
                  <Col md={4} xs={4}>
                    <Form.Group>
                      <Form.Label>Lucro</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          className="text-end"
                          value={util.formatMoney(itemEstoque.lucro)}
                          disabled
                        />
                        <InputGroup.Text>{ itemEstoque.lucro ? (((itemEstoque.valor_venda - itemEstoque.valor_compra) / itemEstoque.valor_venda) * 100).toFixed(0) : 0}%</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={8} xs={8}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Control type="text" value={produto.categoria.nome} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4} xs={4}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Control type="text" value={itemEstoque.status} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Código de Barras</Form.Label>
                      <Form.Control type="text" value={itemEstoque.codigo_barras} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Nota</Form.Label>
                      <Form.Control
                        type="text"
                        value={
                          itemEstoque.nota
                            ? itemEstoque.nota.codigo
                            : "Nenhuma nota associada"
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12} className="d-flex justify-content-end gap-2 mt-3 mb-3">
                    <Button variant="primary">Editar</Button>
                    <Button variant="danger">Excluir</Button>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

function Produtos({ produtos, setItemEstoque }) {
  //console.log(produtos)
  const itens = produtos.itemEstoque;

  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponivel':
        return <Badge bg="success">{status}</Badge>;
      case 'Reservado':
        return <Badge bg="warning">{status}</Badge>;
      case 'Vendido':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="p-0 m-0 pt-3 ">
        {itens.map((produto) => (
          <Card
            key={produto.id}
            className={`alert p-0
                      ${produto.status === "Disponivel" ? "alert-light" : ""}
                      ${produto.status === "Vendido" ? "alert-danger" : ""} 
                      ${produto.status === "Reservado" ? "alert-warning" : ""}`}
            onClick={() => setItemEstoque(produto)}
            style={{cursor: 'pointer'}}
          >
            <Card.Body className="p-0">
              <Row className="px-2 py-1">
                <Col xs={1} className="pe-2 m-0 text-center d-flex align-items-center">
                  <strong >{produto.id}</strong>
                </Col>
                <Col xs={2} className="p-0">
                  <img
                    src={produto.img || "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"}
                    alt={produto.nome}
                    className="img-fluid rounded"
                    style={{maxHeight: "40px"}}
                  />
                </Col>
                <Col xs={3} className="p-2 m-0 text-truncate d-flex align-items-center">
                  <span>
                    {produto.nome}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {util.formatMoney(produto.valor_compra)}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {util.formatMoney(produto.valor_venda)}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {getStatusBadge(produto.status)}
                  </span>
                </Col>
                {/* <div className="col-1  end-0 d-flex flex-wrap gap-2 p-1">
                              <button className="btn btn-outline-danger" type="button"><i className="bi bi-trash3"></i></button>
                              <button className="btn btn-outline-secondary" type="button"><i className="bi bi-three-dots"></i></button>
                          </div> */}
              </Row>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}
