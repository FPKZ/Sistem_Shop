import { useState } from "react";
import useCurrencyInput from "@hooks/useCurrencyInput";

export function usePagamentoVenda(subtotalGlobal, compraBaseGlobal) {
  const [pagamentos, setPagamentos] = useState([]);
  const [pagamentoAtivo, setPagamentoAtivo] = useState(null);

  // Utiliza o hook de moeda para desconto, limitando ao valor de custo
  const {
    value: desconto,
    displayValue: displayDesconto,
    onChange: handleDescontoChange,
  } = useCurrencyInput({
    max: Math.max(subtotalGlobal - compraBaseGlobal, 0),
  });

  const calcularTotalComDesconto = () => {
    return subtotalGlobal - desconto;
  };

  // Soma de todos os pagamentos adicionados
  const totalPagamentosAdicionados = pagamentos
    .map((pagamento) => pagamento.valor_nota)
    .reduce((total, valor) => total + valor, 0);

  // Valor residual da venda
  const sobra = calcularTotalComDesconto() - totalPagamentosAdicionados;

  const handleAdicionarPagamento = (pagamento, closeFn) => {
    if (pagamento.index !== undefined && pagamento.index !== null) {
      const newPagamentos = [...pagamentos];
      newPagamentos[pagamento.index] = {
        forma_pagamento: pagamento.forma_pagamento,
        valor_nota: pagamento.valor_nota,
        parcelas: pagamento.parcelas,
        data_pagamento: pagamento.data_pagamento,
      };
      setPagamentos(newPagamentos);
    } else {
      setPagamentos([...pagamentos, pagamento]);
    }

    if (closeFn) closeFn();
    setPagamentoAtivo(null);
  };

  const handleRemoverPagamento = (index) => {
    const newPagamentos = [...pagamentos];
    newPagamentos.splice(index, 1);
    setPagamentos(newPagamentos);
  };

  const handleEditarPagamento = (index, openFn) => {
    const pgto = pagamentos[index];
    setPagamentoAtivo({ ...pgto, index: index });
    if (openFn) openFn();
  };

  const resetarPagamentos = () => {
    setPagamentos([]);
    setPagamentoAtivo(null);
  };

  return {
    pagamentos,
    pagamentoAtivo,
    setPagamentos,
    setPagamentoAtivo,
    desconto,
    displayDesconto,
    handleDescontoChange,
    calcularTotalComDesconto,
    sobra,
    handleAdicionarPagamento,
    handleRemoverPagamento,
    handleEditarPagamento,
    resetarPagamentos,
  };
}
