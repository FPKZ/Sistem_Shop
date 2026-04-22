import React from "react";

export function VendasFilters({ filters, setFilters, compact }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // O hook useFiltroOrdenacao espera o objeto completo de filtros
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const containerClass = compact 
    ? "bg-transparent p-0" 
    : "bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4";

  const gridClass = compact
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className={containerClass}>
      <div className={gridClass}>
        {/* Filtro Cliente */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente</label>
          <input
            type="text"
            name="cliente.nome" // Mudança para bater com o hook useFiltroOrdenacao
            placeholder="Buscar por cliente..."
            value={filters["cliente.nome"] || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Filtro Vendedor */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vendedor</label>
          <input
            type="text"
            name="vendedor.nome" // Mudança para bater com o hook useFiltroOrdenacao
            placeholder="Buscar por vendedor..."
            value={filters["vendedor.nome"] || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Filtro Status */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            <option value="">Todos</option>
            <option value="andamento">Andamento</option>
            <option value="reservada">Reservada</option>
            <option value="concluida">Concluida</option>
            <option value="cancelada">Cancelada</option>
            <option value="estorno">Estorno</option>
          </select>
        </div>

        {/* Filtro Data */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
          <input
            type="date"
            name="data_venda"
            value={filters.data_venda || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
