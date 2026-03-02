import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import utils from "@app/utils";
import { useOutletContext } from "react-router-dom";

export default function ModalDetalhesVenda({ show, onHide, venda }) {
  const { mobile } = useOutletContext();

  if (!venda) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" fullscreen="lg-down" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Venda #{venda.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col xs={12} md={6} className={mobile ? "border-bottom pb-2 mb-3" : ``}>
          <Row>
              <h5>Informações do Cliente</h5>
              <Col xs={6} md={12}>
                <p>
                  <strong>Nome:</strong> {venda.cliente?.nome || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {venda.cliente?.email || "N/A"}
                </p>
              </Col>
              <Col xs={6} md={12}>
                <p>
                  <strong>Telefone:</strong> {venda.cliente?.telefone || "N/A"}
                </p>
                <p>
                  <strong>Endereço:</strong> {venda.cliente?.endereco || "N/A"}
                </p>
              </Col>
          </Row>
          </Col>
          <Col xs={12} md={6} className="text-start text-md-end">
          <Row>
              <h5>Resumo</h5>
              <Col xs={6} md={12}>
                <p>
                  <strong>Data:</strong> {utils.formatDate(venda.data_venda)}
                </p>
                <p>
                  <strong>Forma de Pagamento:</strong>{" "}
                  {venda.forma_pagamento}
                </p>
              </Col>
              <Col xs={6} md={12}>
                <p>
                  <strong>Status:</strong> {utils.capitalize(venda.status)}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {utils.formatMoney(venda.valor_total || 0)}
                </p>
              </Col>
          </Row>
          </Col>
        </Row>

        <h5>Produtos</h5>
        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Marca</th>
              <th>Tamanho</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {venda.itensVendidos && venda.itensVendidos.length > 0 ? (
              venda.itensVendidos.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.itemEstoque.nome}
                  </td>
                  <td>{item.itemEstoque.marca}</td>
                  <td>{item.itemEstoque.tamanho}</td>
                  <td>
                    {utils.formatMoney(item.itemEstoque.valor_venda)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Nenhum produto listado.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
