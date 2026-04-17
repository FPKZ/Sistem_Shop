import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usePermissoes } from "@hooks/auth/usePermissoes";


export function VendasDashboardCards() {
  const navigate = useNavigate();
  const { pode } = usePermissoes();

  return (
    <Row className="mb-4 g-3">
      <Col xs={12} sm={4}>
        <Card
          className="h-100 border-0 shadow-sm text-white hover:scale-105 transition cursor-pointer"
          style={{
            background: "linear-gradient(45deg, #6f42c1, #8d5bd6)",
          }}
          onClick={() => navigate("Nova-Venda")}
        >
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-0">Nova Venda</h5>
              <small>Iniciar nova venda</small>
            </div>
            <i className="bi bi-cart-plus fs-2 opacity-50"></i>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={4}>
        <Card
          className={`h-100 border-0 shadow-sm ${pode("realizarExtorno") ? "hover:scale-105 transition cursor-pointer" : "bg-stone-200! opacity-70!" }`}
          style={{ borderLeft: "4px solid #dc3545" }}
          onClick={() => pode("realizarExtorno") && navigate("Extorno")}
        >
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-0 text-danger">Estorno</h6>
              <small className="text-muted">Cancelar venda</small>
            </div>
            <i className="bi bi-arrow-counterclockwise fs-3 text-danger opacity-50"></i>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={4}>
        <Card
          className={`h-100 border-0 shadow-sm ${pode("realizarDevolucao") ? "hover:scale-105 transition cursor-pointer" : "bg-stone-200! opacity-70!" }`}
          style={{ borderLeft: "4px solid #ffc107" }}
          onClick={() => pode("realizarDevolucao") && navigate("Devolucao")}
        >
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-0 text-warning">Devolução</h6>
              <small className="text-muted">Registrar devolução</small>
            </div>
            <i className="bi bi-box-seam fs-3 text-warning opacity-50"></i>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
