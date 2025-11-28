import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import utils from "@app/utils";

export default function ModalDetalhesVenda({ show, onHide, venda }) {
  if (!venda) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da Venda #{venda.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <h5>Informações do Cliente</h5>
            <p>
              <strong>Nome:</strong> {venda.cliente?.nome || "N/A"}
            </p>
            <p>
              <strong>Data:</strong> {utils.formatDate(venda.data_venda)}
            </p>
            <p>
              <strong>Status:</strong> {utils.capitalize(venda.status)}
            </p>
          </Col>
          <Col md={6} className="text-end">
            <h5>Resumo</h5>
            <p>
              <strong>Total:</strong>{" "}
              {utils.formatMoney(venda.valor_total || 0)}
            </p>
          </Col>
        </Row>

        <h5>Produtos</h5>
        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Valor Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens_venda && venda.itens_venda.length > 0 ? (
              venda.itens_venda.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.produto?.nome || item.nome_produto || "Produto"}
                  </td>
                  <td>{item.quantidade}</td>
                  <td>{utils.formatMoney(item.valor_unitario)}</td>
                  <td>
                    {utils.formatMoney(item.quantidade * item.valor_unitario)}
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
