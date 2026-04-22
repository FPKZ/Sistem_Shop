import { Modal } from "react-bootstrap";
import utils from "@services/utils";
import { useOutletContext } from "react-router-dom";
import { User, Receipt, Package, Calendar, CreditCard, Tag, X } from "lucide-react";

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
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style}`}>
      {status}
    </span>
  );
};

export default function ModalDetalhesVenda({ show, onHide, venda }) {
  const { mobile } = useOutletContext();

  if (!venda) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      fullscreen="lg-down" 
      centered
      className="premium-modal"
    >
      <div className="bg-white rounded-t-2xl lg:rounded-2xl overflow-hidden border-0 shadow-2xl flex flex-col h-full lg:h-auto lg:max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Receipt className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">Venda #{venda.id}</h2>
              <p className="text-xs text-slate-500 font-medium">Detalhes completos da transação</p>
            </div>
          </div>
          <button 
            onClick={onHide}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Card */}
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-primary" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Informações do Cliente</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Nome:</span>
                  <span className="text-sm font-bold text-slate-700">{venda.cliente?.nome || "Consumidor Final"}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Telefone:</span>
                  <span className="text-sm font-medium text-slate-600">{venda.cliente?.telefone || "Não informado"}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Email:</span>
                  <span className="text-sm font-medium text-slate-600">{venda.cliente?.email || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Transaction Card */}
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={16} className="text-primary" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Resumo da Venda</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Status:</span>
                  <StatusBadge status={venda.status} />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Data:</span>
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-300" />
                    {utils.formatDate(venda.data_venda)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Pagamento:</span>
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-slate-300" />
                    {venda.forma_pagamento || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Package size={16} className="text-primary" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Itens da Venda</h3>
            </div>
            
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden text-sm uppercase">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100/50 text-[10px] font-black text-slate-400 tracking-widest border-b border-slate-100">
                <div className="col-span-6">Produto</div>
                <div className="col-span-2 text-center">Marca</div>
                <div className="col-span-2 text-center">Tamanho</div>
                <div className="col-span-2 text-right">Preço</div>
              </div>

              <div className="divide-y divide-slate-100">
                {venda.itensVendidos && venda.itensVendidos.length > 0 ? (
                  venda.itensVendidos.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 items-center bg-white group hover:bg-slate-50 transition-colors">
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                          {index + 1}
                        </div>
                        <span className="font-bold text-slate-700">{item.itemEstoque?.nome}</span>
                      </div>
                      <div className="col-span-2 text-start md:text-center md:block flex justify-between items-center">
                        <span className="md:hidden text-[10px] font-bold text-slate-300">Marca:</span>
                        <span className="text-slate-500 font-semibold">{item.itemEstoque?.marca}</span>
                      </div>
                      <div className="col-span-2 text-start md:text-center md:block flex justify-between items-center">
                        <span className="md:hidden text-[10px] font-bold text-slate-300">Tam:</span>
                        <span className="text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{item.itemEstoque?.tamanho}</span>
                      </div>
                      <div className="col-span-2 text-right md:block flex justify-between items-center">
                        <span className="md:hidden text-[10px] font-bold text-slate-300">Preço:</span>
                        <span className="font-black text-slate-800">{utils.formatMoney(item.itemEstoque?.valor_venda)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 font-medium lowercase">
                    Nenhum produto listado nesta venda.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Total */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex justify-between items-center gap-4 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Total</span>
            <span className="text-2xl font-black text-primary leading-tight">{utils.formatMoney(venda.valor_total || 0)}</span>
          </div>
          <button
            onClick={onHide}
            className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
