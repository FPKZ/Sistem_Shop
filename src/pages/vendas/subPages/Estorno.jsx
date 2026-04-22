import utils from "@services/utils";
import { Search, RotateCcw, Package, User, CheckCircle2, AlertCircle, Info, ChevronRight, X } from "lucide-react";
import { Spinner } from "react-bootstrap";
import Confirm from "@components/modal/Confirm";
import { useEstorno } from "@hooks/vendas/useEstorno";

export default function Estorno() {
  const {
    searchTerm,
    setSearchTerm,
    venda,
    results,
    loading,
    erro,
    isSearching,
    buscarVendas,
    carregarVenda,
    resetSearch,
    showConfirm,
    setShowConfirm,
    handleConfirmarEstorno,
    confirmarEstornoReal
  } = useEstorno();

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <Confirm 
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={confirmarEstornoReal}
        title="Confirmar Estorno Total"
        message={`Você confirma o estorno total da venda #${venda?.id}? Esta ação devolverá todos os produtos ao estoque e cancelará o financeiro.`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Estorno de Venda</h1>
          <p className="text-slate-500 font-medium">Reverso total de transações e estoque</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Search Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-end gap-4 relative z-10 transition-all hover:shadow-md">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID da Venda, Cliente ou Vendedor</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarVendas()}
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 font-bold"
                />
                {searchTerm && (
                  <button 
                    onClick={resetSearch}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => buscarVendas()}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <span>Localizar</span>
                  <Search size={18} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>

          {erro && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{erro}</span>
            </div>
          )}

          {/* Results List */}
          {isSearching && results.length > 0 && !venda && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Selecione a venda para estorno</h3>
               </div>
               <div className="divide-y divide-slate-50">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => carregarVenda(r.id)}
                      className="w-full text-left p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          #{r.id}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{r.cliente?.nome || "Consumidor Final"}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{utils.formatDate(r.data_venda)} • {utils.formatMoney(r.valor_total)}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* Product conference */}
          {venda ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
              <div className="p-5 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Package className="text-primary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Conferência dos Produtos</h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <User size={12} /> {venda.cliente?.nome || "Consumidor Final"}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  ID #{venda.id}
                </div>
              </div>

              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white sticky top-0 z-10">
                  <div className="col-span-8">Produto</div>
                  <div className="col-span-4 text-right">Valor</div>
                </div>

                {venda.itensVendidos && venda.itensVendidos.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center">
                    <div className="col-span-8 flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.itemEstoque?.nome}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Tam: {item.itemEstoque?.tamanho} • Marca: {item.itemEstoque?.marca}</span>
                    </div>
                    <div className="col-span-4 text-right">
                      <span className="text-sm font-black text-slate-800">{utils.formatMoney(item.itemEstoque?.valor_venda)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !erro && !isSearching && (
              <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <Info size={40} className="text-slate-300" />
                </div>
                <h3 className="text-slate-600 font-black text-lg mb-1 tracking-tight">Buscar Venda</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Localize uma venda pelo ID, Nome do Cliente ou Vendedor para iniciar o estorno total.</p>
              </div>
            )
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden divide-y divide-slate-50">
            <div className="p-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informações Financeiras</h3>
              {venda ? (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-400">Total da Venda</span>
                       <span className="text-slate-700">{utils.formatMoney(venda.valor_total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-slate-400">Desconto</span>
                       <span className="text-rose-500">-{utils.formatMoney(venda.desconto)}</span>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3">
                       <AlertCircle size={16} className="text-rose-500" />
                       <span className="text-[10px] font-black text-rose-600 uppercase">Estorno de {venda.forma_pagamento}</span>
                    </div>
                 </div>
              ) : (
                 <div className="py-8 text-center space-y-2">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                       <RotateCcw size={24} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aguardando seleção</p>
                 </div>
              )}
            </div>

            <div className="p-5 bg-slate-50/50">
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total a Estornar</span>
                <span className={`text-4xl font-black tracking-tight transition-colors ${venda ? 'text-primary' : 'text-slate-300'}`}>
                  {venda ? utils.formatMoney(venda.valor_recebido) : "R$ 0,00"}
                </span>
              </div>

              <button
                onClick={handleConfirmarEstorno}
                disabled={!venda || loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-fuchsia-600 text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:translate-y-0"
              >
                {loading ? <Spinner animation="border" size="sm" /> : <><RotateCcw size={20} /><span>Confirmar Estorno Total</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
