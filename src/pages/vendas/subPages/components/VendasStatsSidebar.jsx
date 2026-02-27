import { Card, Row, Col } from "react-bootstrap";
import utils from "@app/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export function VendasStatsSidebar({ stats, chartData }) {
  return (
    <div className="d-flex flex-column gap-3">
      {/* Total Revenue Card */}
      <Card className="border-0 shadow-sm bg-primary text-white">
        <Card.Body>
          <h6 className="opacity-75 mb-2">Receita Total</h6>
          <h2 className="fw-bold mb-0">
            {utils.formatMoney(stats.totalReceita)}
          </h2>
          <small className="opacity-75">
            {stats.totalVendas} vendas realizadas
          </small>
        </Card.Body>
      </Card>

      {/* Stats Grid */}
      <Row className="g-2">
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <h6 className="text-muted small mb-1">Pendentes</h6>
              <h4 className="fw-bold text-warning mb-0">
                {stats.vendasPendentes}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <h6 className="text-muted small mb-1">Atrasados</h6>
              <h4 className="fw-bold text-danger mb-0">
                {stats.pagamentosAtrasados}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <h6 className="text-muted small mb-1">Devoluções</h6>
              <h4 className="fw-bold text-info mb-0">{stats.devolucoes}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-3">
              <h6 className="text-muted small mb-1">Concluídas</h6>
              <h4 className="fw-bold text-success mb-0">
                {stats.vendasConcluidas}
              </h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Desempenho (7 dias)</h6>
        </Card.Header>
        <Card.Body style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip
                formatter={(value, name) => [
                  name === "receita" ? utils.formatMoney(value) : value,
                  name === "receita" ? "Receita" : "Vendas",
                ]}
              />
              <Bar dataKey="receita" fill="#0d6efd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </div>
  );
}
