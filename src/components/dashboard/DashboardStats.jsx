import { Card, Row, Col } from "react-bootstrap";
import utils from "@app/utils";

export function DashboardStats({ stats }) {
  const cards = [
    {
      title: "Vendas Totais",
      value: stats.totalVendas,
      icon: <i className="bi bi-graph-up-arrow text-primary fs-3"></i>,
      color: "border-primary",
    },
    {
      title: "Receita Total",
      value: utils.formatMoney(stats.receitaTotal),
      icon: <i className="bi bi-currency-dollar text-success fs-3"></i>,
      color: "border-success",
    },
    {
      title: "Lucro Estimado",
      value: utils.formatMoney(stats.lucroTotal),
      icon: <i className="bi bi-check-circle-fill text-info fs-3"></i>,
      color: "border-info",
    },
    {
      title: "Pagamentos Atrasados",
      value: stats.pagamentosAtrasados,
      icon: (
        <i
          className={`bi bi-exclamation-circle-fill fs-3 ${
            stats.pagamentosAtrasados > 0 ? "text-danger" : "text-secondary"
          }`}
        ></i>
      ),
      color: stats.pagamentosAtrasados > 0 ? "border-danger" : "border-secondary",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((card, idx) => (
        <Col key={idx} xs={12} sm={6} md={3}>
          <Card className={`shadow-sm border-start border-4 ${card.color} h-100`}>
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-light p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                {card.icon}
              </div>
              <div>
                <Card.Subtitle className="text-muted small mb-1">{card.title}</Card.Subtitle>
                <Card.Title className="h4 mb-0 fw-bold">{card.value}</Card.Title>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
