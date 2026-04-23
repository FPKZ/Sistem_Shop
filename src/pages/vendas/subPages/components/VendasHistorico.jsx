import { useState } from "react";
import TabelaVendas from "@tabelas/TabelaVendas";
import PaginationButtons from "@components/Pagination/PaginationButtons";
import { VendasFilters } from "./VendasFilters";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

export function VendasHistorico({
  mobile,
  vendas,
  currentItems,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  handleViewVenda,
  paginate,
  filters,
  setFilters,
}) {
  const [showFilters, setShowFilters] = useState(!mobile);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-0.5">
              Histórico de Vendas
            </h2>
            <p className="text-xs text-slate-500 mb-0">
              Transações recentes e filtros
            </p>
          </div>

          {mobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all ${
                showFilters ? "text-[#ec48f9]" : "text-slate-600"
              }`}
            >
              <Filter size={18} fill={showFilters ? "#ec48f9" : "#ffffff"} />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 px-2 uppercase tracking-wider">
            Exibir
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-semibold text-slate-700"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Seção Filtros */}
      {(showFilters || !mobile) && (
        <div className="p-3 bg-slate-50/30 border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <VendasFilters filters={filters} setFilters={setFilters} compact />
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white px-2">
        <TabelaVendas vendas={currentItems} onView={handleViewVenda} />
      </div>

      <div className="p-3 bg-slate-50/50 border-t border-slate-100 mt-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="">
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        </div>
        <div className="text-sm text-slate-500 text-end mt-3 mt-md-0">
          Mostrando{" "}
          <span className="font-semibold text-slate-800">
            {currentItems.length}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-slate-800">{vendas.length}</span>{" "}
          vendas
        </div>
      </div>
    </div>
  );
}
