import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@hooks/useDashboardData";
import { DashboardStats } from "@components/dashboard/DashboardStats";
import { DashboardCharts } from "@components/dashboard/DashboardCharts";
import { DashboardAlerts } from "@components/dashboard/DashboardAlerts";
import { Row, Col, Button, Spinner } from "react-bootstrap";

function App() {
  const navigate = useNavigate();
  const { stats, chartData, estoqueBaixo, notasVencendo, loading, refreshing } = useDashboardData();

  const atalhos = [
    {
      label: "Novo Cadastro",
      icon: <i className="bi bi-plus-square-fill fs-6"></i>,
      path: "cadastro",
      color: "text-primary",
    },
    {
      label: "Vendas",
      icon: <i className="bi bi-bag-fill fs-6"></i>,
      path: "vendas",
      color: "text-success",
    },
    {
      label: "Produtos",
      icon: <i className="bi bi-grid-fill fs-6"></i>,
      path: "produtos",
      color: "text-info",
    },
    {
      label: "Clientes",
      icon: <i className="bi bi-journal-bookmark-fill fs-6"></i>,
      path: "clientes",
      color: "text-warning",
    },
    {
      label: "Notas",
      icon: <i className="bi bi-upc fs-6"></i>,
      path: "notas",
      color: "text-secondary",
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      {/* Header do Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h1 className="h2 fw-bold mb-0 text-dark">Painel de Controle</h1>
          <p className="text-muted small mb-0">
            Bem-vindo ao sistema de gestão Sistem Shop.
          </p>
        </div>
        <div className="d-flex align-items-center bg-white px-3 py-2 rounded shadow-sm border">
          <i className={`bi bi-arrow-clockwise fs-6 text-primary me-2 ${refreshing ? "spin-animation" : ""}`}></i>
          <span className="small text-muted">{refreshing ? "Sincronizando..." : "Sincronizado"}</span>
        </div>
      </div>

      {/* Visão Geral (Cards) */}
      <DashboardStats stats={stats} />

      <Row className="g-4">
        {/* Gráfico de Desempenho */}
        <Col xs={12} xl={8}>
          <DashboardCharts chartData={chartData} />
        </Col>

        {/* Atalhos Rápidos */}
        <Col xs={12} xl={4}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="fw-bold mb-4">Atalhos Rápidos</h5>
            <div className="d-grid gap-3">
              {atalhos.map((at, idx) => (
                <Button
                  key={idx}
                  variant="light"
                  className={`d-flex align-items-center justify-content-start p-3 border-0 shadow-sm transition-hover ${at.color}`}
                  onClick={() => navigate(at.path)}
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <span className="me-3">{at.icon}</span>
                  <span className="fw-medium">{at.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Alertas */}
      <div className="mt-4">
        <DashboardAlerts
          estoqueBaixo={estoqueBaixo}
          notasVencendo={notasVencendo}
        />
      </div>
    </div>
  );
}

export default App;
