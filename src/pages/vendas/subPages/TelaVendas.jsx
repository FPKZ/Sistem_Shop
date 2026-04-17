import { Row, Col, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { usePagination } from "@hooks/usePagination";
import ModalDetalhesVenda from "@components/modal/Vendas/ModalDetalhesVenda";

import { useVendasDashboard } from "@hooks/vendas/useVendasDashboard";
import { VendasDashboardCards } from "./components/VendasDashboardCards";
import { VendasHistorico } from "./components/VendasHistorico";
import { VendasStatsSidebar } from "./components/VendasStatsSidebar";

export default function TelaVendas() {
  const { mobile } = useOutletContext();
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { vendas, loading, stats, chartData } = useVendasDashboard();

  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(vendas, 5);

  const handleViewVenda = (venda) => {
    setSelectedVenda(venda);
    setShowModal(true);
  };

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
    <div className="p-2 pt-3 p-md-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Vendas</h2>
        <span className="text-muted">
          Gerencie suas vendas e acompanhe o desempenho
        </span>
      </div>

      <VendasDashboardCards />

      <Row className="g-4">
        <Col md={8}>
          <VendasHistorico
            mobile={mobile}
            vendas={vendas}
            currentItems={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
            handleViewVenda={handleViewVenda}
            paginate={paginate}
          />
        </Col>

        <Col md={4}>
          <VendasStatsSidebar stats={stats} chartData={chartData} />
        </Col>
      </Row>

      <ModalDetalhesVenda
        show={showModal}
        onHide={() => setShowModal(false)}
        venda={selectedVenda}
      />
    </div>
  );
}
