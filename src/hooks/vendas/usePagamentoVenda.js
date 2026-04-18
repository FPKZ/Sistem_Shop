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
    const forma = pagamento.forma_pagamento;

    // Modo edição (index definido): simplesmente substitui o registro
    if (pagamento.index !== undefined && pagamento.index !== null) {
      const newPagamentos = [...pagamentos];
      newPagamentos[pagamento.index] = {
        forma_pagamento: forma,
        valor_nota: pagamento.valor_nota,
        parcelas: pagamento.parcelas,
        data_pagamento: pagamento.data_pagamento,
      };
      setPagamentos(newPagamentos);
      if (closeFn) closeFn();
      setPagamentoAtivo(null);
      return;
    }

    // Promissória: só permite uma
    if (forma === "Promissória") {
      const jaExiste = pagamentos.some((p) => p.forma_pagamento === "Promissória");
      if (jaExiste) {
        // Não adiciona novamente — poderia exibir toast aqui se quiser
        if (closeFn) closeFn();
        setPagamentoAtivo(null);
        return;
      }
    }

    // Dinheiro e Pix: combina com o existente (acumula valor)
    if (forma === "Dinheiro" || forma === "Pix") {
      const existingIndex = pagamentos.findIndex(
        (p) => p.forma_pagamento === forma
      );
      if (existingIndex !== -1) {
        const newPagamentos = [...pagamentos];
        newPagamentos[existingIndex] = {
          ...newPagamentos[existingIndex],
          valor_nota: newPagamentos[existingIndex].valor_nota + pagamento.valor_nota,
        };
        setPagamentos(newPagamentos);
        if (closeFn) closeFn();
        setPagamentoAtivo(null);
        return;
      }
    }

    // Cartão de Crédito, Cartão de Débito e demais: adiciona como novo registro
    setPagamentos([...pagamentos, pagamento]);
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
