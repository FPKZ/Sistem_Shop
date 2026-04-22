import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { usePagination } from "@hooks/usePagination";
import ModalDetalhesVenda from "@components/modal/Vendas/ModalDetalhesVenda";

import { useVendasDashboard } from "@hooks/vendas/useVendasDashboard";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { VendasDashboardCards } from "./components/VendasDashboardCards";
import { VendasHistorico } from "./components/VendasHistorico";
import { VendasStatsSidebar } from "./components/VendasStatsSidebar";

export default function TelaVendas() {
  const { mobile } = useOutletContext();
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { vendas, loading, stats, chartData } = useVendasDashboard();

  // Campos para busca no hook
  const camposBusca = [
    "cliente.nome", 
    "vendedor.nome", 
    "status", 
    "data_venda", 
    "metodo_pagamento"
  ];

  // Hook de filtragem e ordenação
  const { 
    dadosProcessados: filteredVendas, 
    filtro: filters, 
    setFiltro: setFilters 
  } = useFiltroOrdenacao(
    vendas, 
    camposBusca, 
    null, 
    { chave: "data_venda", direcao: "desc" }
  );

  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredVendas, 5);

  const handleViewVenda = (venda) => {
    setSelectedVenda(venda);
    setShowModal(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner animation="border" variant="primary" className="!w-12 !h-12 border-4" />
          <p className="text-slate-500 font-medium animate-pulse">Carregando dashboard...</p>
        </div>
      </div>
    );
  }
  console.log(currentItems)

  return (
    <div className={`p-4 md:p-6 lg:p-8 min-h-screen ${mobile ? 'pb-24' : ''}`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard de Vendas</h1>
          <p className="text-slate-500 font-medium mt-1">Acompanhe métricas, gerencie pedidos e analise o desempenho do seu negócio.</p>
        </div>
      </div>

      {/* Action Cards Section */}
      <VendasDashboardCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales History Table - Takes more space on desktop */}
        <div className="lg:col-span-8 xl:col-span-9 h-full">
          <VendasHistorico
            mobile={mobile}
            vendas={filteredVendas}
            currentItems={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
            handleViewVenda={handleViewVenda}
            paginate={paginate}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Stats and Charts Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <VendasStatsSidebar stats={stats} chartData={chartData} />
        </div>
      </div>

      <ModalDetalhesVenda
        show={showModal}
        onHide={() => setShowModal(false)}
        venda={selectedVenda}
      />
    </div>
  );
}
