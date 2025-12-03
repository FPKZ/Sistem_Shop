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

import { usePagination } from "@hooks/usePagination";
import PaginationButtons from "@components/Pagination/PaginationButtons";
import ItemsPerPageSelector from "@components/Pagination/ItemsPerPageSelector";

const cardStyle = {
  cursor: "pointer",
  fontSize: "0.9rem"
};

export default function TelaVendas() {
  const navigate = useNavigate();

  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    // handlePageChange,
    // handleItemsPerPageChange,
    // indexOfFirstItem,
    // indexOfLastItem,
    // totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(vendas);

  useEffect(() => {
    getVendas();
  }, []);

  const getVendas = async () => {
    setLoading(true);
    const v = await API.getVendas();
    console.log(v)
    setVendas(Array.isArray(v) ? v : []);
    setLoading(false);
  };

  const handleViewVenda = (venda) => {
    setSelectedVenda(venda);
    setShowModal(true);
  };

  // Dashboard Stats
  // O hook useMemo é usado para "memorizar" o resultado do cálculo das estatísticas.
  // Ele só executará esse bloco de código novamente se a variável 'vendas' mudar, melhorando a performance.
  const stats = useMemo(() => {
    // Conta o total de vendas verificando o tamanho do array 'vendas'.
    const totalVendas = vendas.length;

    // Calcula a receita total somando o valor de todas as vendas.
    // O método .reduce percorre cada item (curr) e soma ao acumulador (acc).
    const totalReceita = vendas.reduce(
      // Converte o valor_total para número; se falhar, usa 0.
      (acc, curr) => acc + (Number(curr.total) || 0),
      0 // Valor inicial do acumulador é 0.
    );

    // Filtra o array de vendas para encontrar apenas as com status "concluida" e conta quantas são (.length).
    const vendasConcluidas = vendas.filter(
      (v) => v.status === "concluida"
    ).length;

    // Filtra e conta vendas que estão "pendente" OU "aguardando pagamento".
    const vendasPendentes = vendas.filter(
      (v) => v.status === "pendente" || v.status === "aguardando pagamento"
    ).length; 

    // Filtra e conta vendas que foram "devolvida" OU são "estorno".
    const devolucoes = vendas.filter(
      (v) => v.status === "devolvida" || v.status === "estorno"
    ).length; 

    // Filtra e conta vendas que estão com status "atrasado".
    const pagamentosAtrasados = vendas.filter(
      (v) => v.status === "atrasado"
    ).length;

    // Retorna um objeto com todas as estatísticas calculadas acima para ser usado no componente.
    return {
      totalVendas,
      totalReceita,
      vendasConcluidas,
      vendasPendentes,
      devolucoes,
      pagamentosAtrasados,
    };
  }, [vendas]); // Lista de dependências: recalcula se 'vendas' mudar.

  // Prepara os dados para serem exibidos em um gráfico, também memorizado com useMemo.
  const chartData = useMemo(() => {
    // Agrupa as vendas por data usando .reduce.
    const grouped = vendas.reduce((acc, curr) => {
      // Formata a data da venda e pega apenas a primeira parte (a data em si), ignorando a hora.
      const date = utils.formatDate(curr.data_venda).split(" ")[0];
      
      // Se essa data ainda não existe no acumulador, cria um objeto inicial para ela.
      if (!acc[date]) {
        acc[date] = { name: date, vendas: 0, receita: 0 };
      }
      // Incrementa a contagem de vendas para essa data.
      acc[date].vendas += 1;
      // Soma o valor total da venda à receita dessa data.
      acc[date].receita += Number(curr.total) || 0;
      
      return acc; // Retorna o acumulador atualizado.
    }, {}); // Começa com um objeto vazio.

    // Transforma o objeto agrupado em um array de valores e pega apenas os últimos 7 itens (últimos 7 dias/registros).
    return Object.values(grouped).slice(-7);
  }, [vendas]); // Recalcula se 'vendas' mudar.
  console.log(chartData);

  // Define uma função simples para atualizar o estado da página atual (usado na paginação).
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Verifica se a aplicação está em estado de carregamento (loading).
  if (loading) {
    // Se estiver carregando, retorna um componente visual de "Loading" (Spinner) centralizado na tela.
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }} // Define a altura como 100% da altura da janela (viewport height).
      >
        {/* Componente de Spinner (rodinha girando) do Bootstrap */}
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
            className="h-100 border-0 shadow-sm text-white hover:scale-105 transition cursor-pointer"
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
            className="h-100 border-0 shadow-sm hover:scale-105 transition cursor-pointer"
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
            className="h-100 border-0 shadow-sm hover:scale-105 transition cursor-pointer"
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
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-4 text-center"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </Form.Select>
                </div>
              </div>

              <TabelaVendas vendas={currentItems} onView={handleViewVenda} />

              {/* Pagination Controls */}
              <div className="my-2">
                <PaginationButtons
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>
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
