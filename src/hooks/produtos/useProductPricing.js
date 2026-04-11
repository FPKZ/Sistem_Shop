import { useMemo } from "react";
import useCurrencyInput from "@hooks/useCurrencyInput";

/**
 * Hook para gerenciar o cálculo de precificação de produtos (Compra, Venda e Lucro).
 * 
 * @param {Object} initialValues - Valores iniciais (opcional).
 * @returns {Object} Hooks de moeda e manipuladores de mudança.
 */
export default function useProductPricing(initialValues = {}) {
  const valorCompra = useCurrencyInput({ initialValue: initialValues.valor_compra || 0 });
  const valorVenda = useCurrencyInput({ initialValue: initialValues.valor_venda || 0 });
  const lucro = useCurrencyInput({ initialValue: initialValues.lucro || 0 });

  const handleValorCompraChange = (e) => {
    valorCompra.onChange(e);
    const newValorCompra = parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    
    if (valorVenda.value > 0) {
      lucro.setValue(valorVenda.value - newValorCompra);
    } else if (lucro.value > 0) {
      valorVenda.setValue(newValorCompra + lucro.value);
    }
  };

  const handleValorVendaChange = (e) => {
    valorVenda.onChange(e);
    const newValorVenda = parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    
    if (valorCompra.value > 0) {
      lucro.setValue(newValorVenda - valorCompra.value);
    }
  };

  const handleLucroChange = (e) => {
    lucro.onChange(e);
    const newLucro = parseFloat(e.target.value.replace(/\D/g, "")) / 100 || 0;
    
    if (valorCompra.value > 0) {
      valorVenda.setValue(valorCompra.value + newLucro);
    }
  };

  const resetPricing = () => {
    valorCompra.setValue(0);
    valorVenda.setValue(0);
    lucro.setValue(0);
  };

  return {
    valorCompra,
    valorVenda,
    lucro,
    handlers: useMemo(() => ({
      handleValorCompraChange,
      handleValorVendaChange,
      handleLucroChange,
      resetPricing
    }), [valorCompra.value, valorVenda.value, lucro.value])
  };
}
