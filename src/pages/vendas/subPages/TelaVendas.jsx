import {
  Row,
  Col,
  Card,
  Button,
  Pagination,
  Form,
  Spinner,
} from "react-bootstrap";
import TabelaVendas from "@tabelas/TabelaVendas";
import { useNavigate } from "react-router-dom";
import API from "@app/api";
import { useEffect, useState, useMemo } from "react";
import utils from "@app/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ModalDetalhesVenda from "./include/ModalDetalhesVenda";

const cardStyle = {
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "transform 0.2s",
};

export default function TelaVendas() {
  const navigate = useNavigate();

  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getVendas();
  }, []);

  const getVendas = async () => {
    setLoading(true);
    const v = await API.getVendas();
    setVendas(Array.isArray(v) ? v : []);
    setLoading(false);
  };

  const handleViewVenda = (venda) => {
    setSelectedVenda(venda);
    setShowModal(true);
  };

  // Dashboard Stats
  const stats = useMemo(() => {
    const totalVendas = vendas.length;
    const totalReceita = vendas.reduce(
      (acc, curr) => acc + (Number(curr.valor_total) || 0),
      0
    );
    const vendasConcluidas = vendas.filter(
      (v) => v.status === "concluida"
    ).length;
    const vendasPendentes = vendas.filter(
      (v) => v.status === "pendente" || v.status === "aguardando pagamento"
    ).length; // Assuming these statuses exist
    const devolucoes = vendas.filter(
      (v) => v.status === "devolvida" || v.status === "estorno"
    ).length; // Assuming these statuses exist
    // Mocking overdue for now as we don't have due date in simple view, or assuming 'atrasado' status
    const pagamentosAtrasados = vendas.filter(
      (v) => v.status === "atrasado"
    ).length;

    return {
      totalVendas,
      totalReceita,
      vendasConcluidas,
      vendasPendentes,
      devolucoes,
      pagamentosAtrasados,
    };
  }, [vendas]);

  // Chart Data
  const chartData = useMemo(() => {
    const grouped = vendas.reduce((acc, curr) => {
      const date = utils.formatDate(curr.data_venda).split(" ")[0];
      if (!acc[date]) {
        acc[date] = { name: date, vendas: 0, receita: 0 };
      }
      acc[date].vendas += 1;
      acc[date].receita += Number(curr.valor_total) || 0;
      return acc;
    }, {});
    return Object.values(grouped).slice(-7);
  }, [vendas]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vendas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vendas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Vendas</h2>
        <span className="text-muted">
          Gerencie suas vendas e acompanhe o desempenho
        </span>
      </div>

      {/* Action Cards */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={4}>
          <Card
            className="h-100 border-0 shadow-sm text-white"
            style={{
              ...cardStyle,
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
            className="h-100 border-0 shadow-sm"
            style={{ ...cardStyle, borderLeft: "4px solid #dc3545" }}
            onClick={() => navigate("Extorno")}
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
            className="h-100 border-0 shadow-sm"
            style={{ ...cardStyle, borderLeft: "4px solid #ffc107" }}
            onClick={() => navigate("Devolucao")}
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

      <Row className="g-4">
        {/* Left Column: Sales List */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Histórico de Vendas</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Exibir:</span>
                  <Form.Select
                    size="sm"
                    style={{ width: "70px" }}
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </Form.Select>
                </div>
              </div>

              <TabelaVendas vendas={currentItems} onView={handleViewVenda} />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => paginate(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Dashboard & Stats */}
        <Col lg={4}>
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
                    <h4 className="fw-bold text-info mb-0">
                      {stats.devolucoes}
                    </h4>
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
                    <Bar
                      dataKey="receita"
                      fill="#0d6efd"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <ModalDetalhesVenda
        show={showModal}
        onHide={() => setShowModal(false)}
        venda={selectedVenda}
      />
    </>
  );
}
