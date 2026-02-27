import { Row, Col, Form } from "react-bootstrap";

export function VendaHeader({ reservar, setReservar }) {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Nova Venda</h2>
        <span className="text-muted">
          Registre uma nova venda para o cliente
        </span>
      </div>

      <Row className="g-4">
        <Col
          xs={12}
          className="d-flex align-items-center justify-content-end gap-2 m-0 mt-2 mt-mb-0 mb-2 pe-4"
        >
          <Form.Check
            type="switch"
            id="custom-switch-page"
            label="Reservar Produtos"
            checked={reservar}
            onChange={(e) => setReservar(e.target.checked)}
            className="m-0 small"
          />
        </Col>
      </Row>
    </>
  );
}
