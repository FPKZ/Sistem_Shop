import { useEffect, useRef, useState } from "react";
import { Form, Collapse } from "react-bootstrap";
import utils from "@services/utils";
import {
  Trash2,
  Pencil,
  CreditCard,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";
import useCurrencyInput from "@hooks/useCurrencyInput";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";

/* ─────────────────────────────────────────────
   Sub-componente: Formulário de pagamento inline
   Vive dentro do resumo (fundo escuro)
───────────────────────────────────────────────*/
function PagamentoForm({ valorTotal, total, pagamentoEdit, pagamentos, onAdd, onCancel }) {
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [codigoPagamento, setCodigoPagamento] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [index, setIndex] = useState(null);

  const {
    value: valorPagamento,
    displayValue: displayValorPagamento,
    onChange: handleValorChange,
    setValue: setValorPagamento,
  } = useCurrencyInput({
    // Removida a trava de valor máximo para permitir troco
  });

  const hasPromissoria = pagamentos?.some(p => p.forma_pagamento === "Promissória" && p.index !== index);

  useEffect(() => {
    if (pagamentoEdit) {
      setValorPagamento(
        pagamentoEdit.valor_nota !== undefined
          ? pagamentoEdit.valor_nota
          : pagamentoEdit.valor_pagamento
      );
      setFormaPagamento(pagamentoEdit.forma_pagamento);
      setCodigoPagamento(pagamentoEdit.codigo || "");
      setParcelas(pagamentoEdit.parcelas || 1);
      setDataPagamento(
        pagamentoEdit.data_pagamento
          ? typeof pagamentoEdit.data_pagamento === "string"
            ? pagamentoEdit.data_pagamento.split("T")[0]
            : new Date(pagamentoEdit.data_pagamento).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setIndex(pagamentoEdit.index);
    } else {
      setValorPagamento(valorTotal);
      setFormaPagamento("Dinheiro");
      setCodigoPagamento("");
      setParcelas(1);
      setDataPagamento(new Date().toISOString().split("T")[0]);
      setIndex(null);
    }
  }, [pagamentoEdit, valorTotal, total, setValorPagamento]);

  const handleSubmit = () => {
    let pagamento = {};
    switch (formaPagamento) {
      case "Dinheiro":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_nota: valorPagamento,
          data_pagamento: new Date().toISOString(),
        };
        break;
      case "Cartão de Crédito":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_nota: valorPagamento,
          codigo: codigoPagamento,
          parcelas,
          data_pagamento: new Date().toISOString(),
        };
        break;
      case "Promissória":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_nota: valorPagamento,
          parcelas,
          data_pagamento: dataPagamento,
        };
        break;
      default:
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_nota: valorPagamento,
          codigo: codigoPagamento,
          data_pagamento: new Date().toISOString(),
        };
    }
    if (index !== undefined && index !== null) {
      pagamento = { ...pagamento, index };
    }
    onAdd(pagamento);
  };

  return (
    <div className="venda-pagamento-form bg-white/5 border border-white/10! rounded-xl p-4 mb-3">
      <p className="font-bold mb-3 text-white/80 text-[0.85rem]">
        {pagamentoEdit ? "✏️ Editar Pagamento" : "💳 Novo Pagamento"}
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-white/60 text-[0.75rem] mb-1 block">Forma de Pagamento</label>
          <Form.Select
            size="sm"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            {!hasPromissoria && <option value="Promissória">Promissória</option>}
          </Form.Select>
        </div>

        <div>
          <label className="text-white/60 text-[0.75rem] mb-1 block">Valor</label>
          <Form.Control
            size="sm"
            type="text"
            placeholder="R$ 0,00"
            value={displayValorPagamento}
            onChange={handleValorChange}
            className="font-bold text-[1rem]"
          />
        </div>

        {formaPagamento !== "Dinheiro" && formaPagamento !== "Promissória" && (
          <div>
            <label className="text-white/60 text-[0.75rem] mb-1 block">Código (Opcional)</label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Ex: 12345"
              value={codigoPagamento}
              onChange={(e) => setCodigoPagamento(e.target.value)}
            />
          </div>
        )}

        {(formaPagamento === "Cartão de Crédito" ||
          formaPagamento === "Promissória") && (
          <div>
            <label className="text-white/60 text-[0.75rem] mb-1 block">Parcelas</label>
            <Form.Select
              size="sm"
              value={parcelas}
              onChange={(e) => setParcelas(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}× {p > 1 ? "parcelas" : "parcela"}
                </option>
              ))}
            </Form.Select>
          </div>
        )}

        {formaPagamento === "Promissória" && (
          <div>
            <label className="text-white/60 text-[0.75rem] mb-1 block">Data de Vencimento</label>
            <Form.Control
              size="sm"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 p-[9px] bg-white/5 border border-white/15! rounded-[10px]! text-white/65 font-semibold text-[0.85rem] cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="flex-[2] p-[9px] bg-gradient-to-br from-[#9b72e8]! to-[#6f42c1]! border-none! rounded-[10px]! text-white font-bold text-[0.9rem] cursor-pointer shadow-[0_3px_12px_rgba(111,66,193,0.4)]"
        >
          {pagamentoEdit ? "Salvar" : "Adicionar"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Componente principal: VendaResumo
───────────────────────────────────────────────*/
export function VendaResumo({
  cliente,
  listaVenda,
  pagamentoState,
  calcularSubtotal,
  handleFinalizarVenda,
  handleCancelarVenda,
  reservar,
  prazoReserva,
  setPrazoReserva,
  podeFinalizar
}) {
  const [showForm, setShowForm] = useState(false);
  const resumoRef = useRef(null);

  // Usa o nosso hook customizado para o observer!
  const resumoVisivel = useIntersectionObserver(resumoRef, { threshold: 0.2 });

  const {
    pagamentos,
    handleRemoverPagamento,
    handleEditarPagamento,
    handleAdicionarPagamento,
    pagamentoAtivo,
    displayDesconto,
    handleDescontoChange,
    calcularTotalComDesconto,
    sobra,
  } = pagamentoState;

  /* Abre form automaticamente quando vem do "editar" */
  useEffect(() => {
    if (pagamentoAtivo) {
      setShowForm(true);
    }
  }, [pagamentoAtivo]);

  const prazos = [
    { label: "1 Dia", value: 1 },
    { label: "3 Dias", value: 3 },
    { label: "7 Dias", value: 7 },
    { label: "15 Dias", value: 15 },
    { label: "30 Dias", value: 30 },
  ];

  return (
    <>
      {/* ===================== SEÇÃO RESUMO ===================== */}
      <div className="bg-roxo-dark p-7 text-white relative venda-resumo-section lg:rounded-2xl" ref={resumoRef}>
        {/* Título */}
        <p className="text-[0.7rem] font-bold tracking-widest uppercase text-white/50 mb-5">
          {reservar ? "Resumo da Reserva" : "Resumo da Venda"}
        </p>

        {/* ── Bloco de Reserva ── */}
        {reservar ? (
          <>
            <p className="text-[0.8rem] text-white/55 mb-3">
              Prazo de Reserva
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {prazos.map((prazo) => (
                <button
                  key={prazo.value}
                  className={`px-3.5 py-1.5 rounded-full! text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 border border-white/20! ${
                    prazoReserva === prazo.value 
                      ? "bg-[#9b72e8] border-[#9b72e8] text-white shadow-[0_2px_10px_rgba(111,66,193,0.4)]" 
                      : "bg-white/5 text-white/70"
                  }`}
                  onClick={() => setPrazoReserva(prazo.value)}
                >
                  {prazo.label}
                </button>
              ))}
            </div>

            {/* Data de expiração */}
            <div className="bg-[#ffc107]/10 border border-[#ffc107]/25! rounded-[10px] py-2.5 px-3.5 flex gap-2.5 items-start mb-4">
              <Clock size={16} color="#ffc107" className="shrink-0 mt-[2px]" />
              <span className="text-[0.8rem] text-white/70 leading-relaxed">
                Reservado até{" "}
                <strong className="text-[#ffc107]">
                  {utils.formatDate(
                    new Date(
                      new Date().getTime() + prazoReserva * 24 * 60 * 60 * 1000
                    )
                  )}
                </strong>
              </span>
            </div>
          </>
        ) : (
          /* ── Bloco de Pagamentos ── */
          <>
            {pagamentos.length > 0 && (
              <div className="mb-3">
                {pagamentos.map((pagamento, index) => (
                  <div key={index} className="bg-white/5 border border-white/10! rounded-[10px] py-3 px-3.5 mb-2 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-bold text-white text-[0.9rem]">
                        {pagamento.forma_pagamento}
                      </div>
                      {pagamento.parcelas > 1 && (
                        <div className="text-[0.75rem] text-white/50">
                          {pagamento.parcelas}× parcelas
                        </div>
                      )}
                      {pagamento.forma_pagamento === "Promissória" &&
                        pagamento.data_pagamento && (
                          <div className="text-[0.75rem] text-white/50">
                            Vence: {utils.formatDate(pagamento.data_pagamento)}
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-[#c29bff]">
                        {utils.formatMoney(pagamento.valor_nota)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleEditarPagamento(index, () =>
                              setShowForm(true)
                            )
                          }
                          className="bg-transparent border-none p-0.5 cursor-pointer text-white/50"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoverPagamento(index)}
                          className="bg-transparent border-none p-0.5 cursor-pointer text-red-400/70"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário inline (Collapse) */}
            <Collapse in={showForm}>
              <div>
                <PagamentoForm
                  valorTotal={sobra}
                  total={calcularTotalComDesconto()}
                  pagamentoEdit={pagamentoAtivo}
                  pagamentos={pagamentos}
                  onAdd={(p) => {
                    handleAdicionarPagamento(p);
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </Collapse>

            {/* Botão Adicionar pagamento */}
            {!showForm && sobra > 0 && (
              <button
                className="w-full p-3 bg-white/5 border-[1.5px] border-dashed border-white/25! rounded-[10px]! text-white/75 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 mb-4 hover:bg-white/10 hover:border-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => setShowForm(true)}
                disabled={
                  !cliente ||
                  listaVenda.length === 0 ||
                  calcularTotalComDesconto() === 0
                }
              >
                <Plus size={16} />
                {pagamentos.length === 0
                  ? "Adicionar forma de pagamento"
                  : "Adicionar outro pagamento"}
              </button>
            )}
          </>
        )}

        {/* ── Linha subtotal + desconto ── */}
        <div className="flex justify-between text-[0.85rem] text-white/50 mb-1.5 mt-3 pt-4 border-t border-white/10!">
          <span>Subtotal</span>
          <span>{utils.formatMoney(calcularSubtotal())}</span>
        </div>

        {!reservar && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[0.8rem] text-white/50 min-w-[70px]">
              Desconto
            </span>
            <Form.Control
              size="sm"
              type="text"
              value={displayDesconto}
              onChange={handleDescontoChange}
              placeholder="R$ 0,00"
              className="venda-desconto-input text-right"
            />
          </div>
        )}

        {/* ── Total ── */}
        <div className="flex justify-between items-center py-4">
          <span className="text-[0.9rem] text-white/60">Total</span>
          <span className="text-[1.9rem] font-extrabold text-[#c29bff] leading-none">
            {utils.formatMoney(calcularTotalComDesconto())}
          </span>
        </div>

        {/* Alerta de saldo devedor ou Troco */}
        {!reservar && pagamentos.length > 0 && (
          <>
            {sobra > 0 && (
              <div className="bg-[#ffc107]/10 border border-[#ffc107]/30! rounded-lg py-2 px-3 text-[0.8rem] text-[#ffc107] flex justify-between mt-2.5">
                <span>Falta pagar</span>
                <span className="font-bold">{utils.formatMoney(sobra)}</span>
              </div>
            )}
            {sobra < 0 && (
              <div className="bg-[#28a745]/10 border border-[#28a745]/30! rounded-lg py-2 px-3 text-[0.8rem] text-[#28a745] flex justify-between mt-2.5">
                <span>Troco</span>
                <span className="font-bold">{utils.formatMoney(Math.abs(sobra))}</span>
              </div>
            )}
          </>
        )}

        {/* ── Botões de ação (Desktop e Mobile dentro do resumo) ── */}
        <button
          className="w-full p-4 bg-gradient-to-br from-[#9b72e8] to-[#6f42c1] border-none rounded-xl! text-white font-bold text-[1.05rem] mt-5! cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(111,66,193,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_28px_rgba(111,66,193,0.5)]"
          onClick={handleFinalizarVenda}
          disabled={!podeFinalizar}
        >
          <CheckCircle
            size={18}
            className="inline-block mr-2 align-middle -mt-0.5"
          />
          {reservar ? "Realizar Reserva" : "Finalizar Venda"}
        </button>

        <button 
          className="w-full p-3 bg-transparent border border-white/15! rounded-xl! text-white/50 font-medium text-[0.9rem] mt-2.5! cursor-pointer transition-all duration-200 hover:border-white/30 hover:text-white/80" 
          onClick={handleCancelarVenda}
        >
          Cancelar
        </button>
      </div>

      {/* ===================== BARRA FIXA MOBILE =====================
          Aparece enquanto o resumo NÃO está visível.
      */}
      <div className={`venda-mobile-bar d-lg-none ${resumoVisivel ? "hidden" : ""}`}>
        <div>
          <div className="text-[0.72rem] text-[#9c8ab4] leading-none mb-0.5">Total a pagar</div>
          <div className="text-[1.5rem] font-extrabold text-[#6f42c1] leading-none">
            {utils.formatMoney(calcularTotalComDesconto())}
          </div>
        </div>
        <button
          className="bg-gradient-to-br from-[#9b72e8] to-[#6f42c1] border-none rounded-full text-white font-bold text-[0.95rem] py-3 px-6 shadow-[0_4px_16px_rgba(111,66,193,0.35)] transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-55 disabled:cursor-not-allowed"
          onClick={handleFinalizarVenda}
          disabled={!podeFinalizar}
        >
          {reservar ? "Reservar" : "Finalizar Venda"}
        </button>
      </div>
    </>
  );
}
