import { useState, useEffect } from "react";
import util from "../../../components/app/utils.js"
import { Modal, Row, Col, Button, Card, Form, Alert, Container, Table, Badge } from "react-bootstrap";

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

export default function ProdutoInfo({ visible, onClose, produto, mobile }) {
  const [itemEstoque, setItemEstoque] = useState({});

  useEffect(() => {
    setItemEstoque({});
  }, [produto]);
  
  if (!visible) return null;
  //console.log(produto)
  
  return (
    <Modal show={visible} onHide={onClose} size="xl" fullscreen="sm-down" dialogClassName="modal-xxl" animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes dos Produtos</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{height: "80dvh", padding: 0, overflow: "auto"}}>
        <Row className="h-100 g-0 p-1">
          {/* Lista de Produtos */}
          <Col md={6} className={`order-md-1 order-2 ${mobile ? "overflow-hidden" : "overflow-auto h-100"}`}>
            <Table responsive hover className="">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Compra</th>
                  <th>Venda</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className={`${mobile ? "overflow-hidden" : "overflow-auto h-100"}`}>
                <Produtos produtos={produto} setItemEstoque={setItemEstoque} />
              </tbody>
            </Table>
          </Col>

          {/* Detalhes */}
          <Col md={6} className={`order-md-2 order-1 pt-3 ${mobile ? "overflow-hidden" : "overflow-auto h-100"}`}>
            <Container fluid className="h-100 d-flex flex-column">
              <div className="text-center mb-3">
                <h3>{produto.nome}</h3>
              </div>

              <div className="text-center h-50 mb-3">
                <img
                  className="img-thumbnail h-100 rounded"
                  src={
                    produto.img || "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"
                  }
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
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" value={itemEstoque.nome} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Marca</Form.Label>
                      <Form.Control type="text" value={itemEstoque.marca} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Tamanho</Form.Label>
                      <Form.Control type="text" value={itemEstoque.tamanho} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={5}>
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

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Preço de Venda</Form.Label>
                      <Form.Control type="text" value={itemEstoque.valor_venda} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Preço de Compra</Form.Label>
                      <Form.Control type="text" value={itemEstoque.valor_compra} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Lucro</Form.Label>
                      <Form.Control
                        type="text"
                        value={itemEstoque.lucro ? `${itemEstoque.lucro}%` : "0%"}
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Control type="text" value={produto.categoria.nome} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
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
  return (
    <>
      {itens.map((produto) => (
        <tr
          key={produto.id}
          className={`alert
                    ${produto.status === "Disponivel" ? "alert-light" : ""}
                    ${produto.status === "Vendido" ? "alert-danger" : ""} 
                    ${produto.status === "Reservado" ? "alert-warning" : ""}`}
          onClick={() => setItemEstoque(produto)}
          style={{cursor: 'pointer'}}
        >
          <td>
            <strong>{produto.id}</strong>
          </td>
          <td>
            <span>
              {produto.nome}
            </span>
          </td>
          <td>
            <span>
              {produto.marca}
            </span>
          </td>
          <td>
            <span>
              {produtos.categoria.nome}
            </span>
          </td>
          <td>
            <span>
              {util.formatMoney(produto.valor_compra)}
            </span>
          </td>
          <td>
            <span>
              {util.formatMoney(produto.valor_venda)}
            </span>
          </td>
          <td>
            <span>
              {getStatusBadge(produto.status)}
            </span>
          </td>
          {/* <div className="col-1  end-0 d-flex flex-wrap gap-2 p-1">
                        <button className="btn btn-outline-danger" type="button"><i className="bi bi-trash3"></i></button>
                        <button className="btn btn-outline-secondary" type="button"><i className="bi bi-three-dots"></i></button>
                    </div> */}
        </tr>
      ))}
    </>
  );
}
