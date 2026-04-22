import utils from "@services/utils";
import { Eye, Printer, MoreVertical, CheckCircle2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { printPDF, getVendaConfig } from "@services/generatePDF";

const StatusBadge = ({ status }) => {
  const configs = {
    concluida: "bg-emerald-100 text-emerald-700 border-emerald-200",
    finalizada: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pendente: "bg-amber-100 text-amber-700 border-amber-200",
    reservada: "bg-amber-100 text-amber-700 border-amber-200",
    cancelada: "bg-rose-100 text-rose-700 border-rose-200",
    estorno: "bg-sky-100 text-sky-700 border-sky-200",
    andamento: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  const style = configs[status?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style}`}>
      {status}
    </span>
  );
};

export default function TabelaVendas({ vendas, onView }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 py-2">
      {/* Header Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
        <div className="col-span-3">Cliente</div>
        <div className="col-span-2">Vendedor</div>
        <div className="col-span-2 text-center">Data</div>
        <div className="col-span-2 text-center">Valor Total</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2 text-end mr-5">Ações</div>
      </div>

      {/* Rows */}
      {vendas && vendas.length > 0 ? (
        vendas.map((venda) => (
          <div
            key={venda.id}
            onClick={() => onView(venda)}
            className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-3 md:px-4 md:py-3 bg-white border border-slate-100 rounded-xl hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Hover Indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            {/* Cliente */}
            <div className="col-span-3 order-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                {venda.cliente?.nome?.charAt(0) || "C"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-full">
                  {venda.cliente?.nome || "Consumidor Final"}
                </span>
                <span className="md:hidden text-[10px] text-slate-400 font-medium lowercase">vendedor: {venda.vendedor?.nome || "não inf."}</span>
              </div>
            </div>

            {/* Vendedor (Desktop Only) */}
            <div className="hidden md:block col-span-2 order-2">
              <span className="text-xs font-medium text-slate-600 truncate block">
                {venda.vendedor?.nome || "Sistema"}
              </span>
            </div>

            {/* Data */}
            <div className="col-span-2 order-2 md:order-3! md:text-center">
              <div className="flex md:flex-col items-center md:items-center gap-2 md:gap-0">
                <span className="md:hidden text-[10px] font-bold text-slate-300 uppercase">Data:</span>
                <span className="text-xs font-semibold text-slate-500">
                  {utils.formatDate(venda.data_venda)}
                </span>
              </div>
            </div>

            {/* Valor */}
            <div className="col-span-2 order-4 md:order-4! md:text-center">
              <div className="flex md:flex-col items-center md:items-center gap-2 md:gap-0">
                <span className="md:hidden text-[10px] font-bold text-slate-300 uppercase">Total:</span>
                <span className="text-sm font-black text-slate-800">
                  {utils.formatMoney(venda.valor_total)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-1 order-2 md:order-5! flex justify-end md:justify-center">
              <StatusBadge status={venda.status} />
            </div>

            {/* Ações */}
            <div className="col-span-2 order-5 md:order-6! flex justify-end gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onView(venda);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                title="Visualizar"
              >
                <Eye size={16} />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const configVenda = getVendaConfig(venda);
                  printPDF(configVenda);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-secondary hover:bg-secondary/5 transition-colors"
                title="Imprimir"
              >
                <Printer size={16} />
              </button>

              {venda.status?.toLowerCase() === "reservada" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/painel/vendas/Nova-Venda?vendaId=${venda.id}`);
                  }}
                  className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                  title="Finalizar Reserva"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}

              {/* Ação de Estorno */}
              {!["estorno", "cancelada", "pendente"].includes(venda.status?.toLowerCase()) && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/painel/vendas/estorno?vendaId=${venda.id}`);
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Realizar Estorno"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <MoreVertical className="text-slate-300" size={32} />
          </div>
          <h3 className="text-slate-600 font-bold mb-1">Nenhuma venda encontrada</h3>
          <p className="text-slate-400 text-sm max-w-xs">Tente ajustar seus filtros ou verifique se há registros no período selecionado.</p>
        </div>
      )}
    </div>
  );
}
