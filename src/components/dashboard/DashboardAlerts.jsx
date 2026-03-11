import { Card, ListGroup, Badge, Row, Col } from "react-bootstrap";
import utils from "@app/utils";

export function DashboardAlerts({ estoqueBaixo, notasVencendo }) {
  return (
    <Row className="g-4 mb-4">
      {/* Estoque Baixo */}
      <Col xs={12} lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Header className="bg-white py-3 border-0 d-flex align-items-center">
            <i className="bi bi-box-seam text-warning me-2 fs-5"></i>
            <h5 className="mb-0 fw-bold">Estoque Baixo</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {estoqueBaixo.length > 0 ? (
              <ListGroup variant="flush">
                {estoqueBaixo.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center py-3 border-light">
                    <div className="d-flex align-items-center">
                      <img src={item.img || "/assets/tube-spinner.svg"} alt={item.nome} className="rounded me-3 shadow-sm" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                      <div>
                        <div className="fw-bold text-dark">{item.nome}</div>
                        <small className="text-muted">ID: {item.id}</small>
                      </div>
                    </div>
                    <Badge bg="danger-light" text="danger" pill className="px-3 py-2">
                       {item.quantidade} unid.
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">Nenhum produto com estoque baixo.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Notas Vencendo */}
      <Col xs={12} lg={6}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Header className="bg-white py-3 border-0 d-flex align-items-center">
            <i className="bi bi-calendar-event text-danger me-2 fs-5"></i>
            <h5 className="mb-0 fw-bold">Notas Pendentes (Próx. 7 dias)</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {notasVencendo.length > 0 ? (
              <ListGroup variant="flush">
                {notasVencendo.map((nota) => (
                  <ListGroup.Item key={nota.id} className="d-flex justify-content-between align-items-center py-3 border-light">
                    <div>
                      <div className="fw-bold text-dark">{nota.fornecedor || "Fornecedor N/A"}</div>
                      <small className="text-muted">Doc: {nota.codigo}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-danger">{utils.formatMoney(nota.valor)}</div>
                      <Badge bg={nota.diasParaVencer <= 0 ? "danger" : "warning-light"} text={nota.diasParaVencer <= 0 ? "white" : "warning"} pill className="small">
                        {nota.diasParaVencer <= 0 ? "VENCIDO" : `Vence em ${nota.diasParaVencer} dias`}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">Nenhuma nota vencendo em breve.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
