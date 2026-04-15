import { Card, Row, Col } from "react-bootstrap";
import utils from "@services/utils";

export function DashboardStats({ stats }) {
  const cards = [
    {
      title: "Vendas Totais",
      value: stats.totalVendas,
      icon: <i className="bi bi-graph-up-arrow text-primary text-[1.4rem] md:text-[1.6rem]"></i>,
      color: "border-primary",
    },
    {
      title: "Receita Total",
      value: utils.formatMoney(stats.receitaTotal),
      icon: <i className="bi bi-currency-dollar text-success text-[1.4rem] md:text-[1.6rem]"></i>,
      color: "border-success",
    },
    {
      title: "Lucro Estimado",
      value: utils.formatMoney(stats.lucroTotal),
      icon: <i className="bi bi-check-circle-fill text-info text-[1.4rem] md:text-[1.6rem]"></i>,
      color: "border-info",
    },
    {
      title: "Pagamentos Atrasados",
      value: stats.pagamentosAtrasados,
      icon: (
        <i
          className={`bi bi-exclamation-circle-fill text-[1.4rem] md:text-[1.6rem] ${
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
        <Col key={idx} xs={6} sm={6} md={3}>
          <Card className={`shadow-sm border-start border-4 ${card.color} h-100`}>
            <Card.Body className="flex flex-col md:flex-row align-items-center p-2">
              <div className="rounded-circle bg-light p-2 mb-2 mb-md-0 me-md-3 d-flex align-items-center justify-content-center w-11 h-11 " >
                {card.icon}
              </div>
              <div className="flex flex-col">
                <Card.Subtitle className="text-muted small mb-1 text-center md:text-start!">{card.title}</Card.Subtitle>
                <Card.Title className="h4 mb-0 fw-bold text-[1.2rem]! md:text-1x1! text-center md:text-start!">{card.value}</Card.Title>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
