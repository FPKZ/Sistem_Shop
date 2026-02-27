import { useState, useEffect } from "react";
import utils from "@app/utils";

/**
 * Hook personalizado para inputs de moeda (BRL).
 * Implementa lógica estilo "ATM" (digitação de centavos).
 *
 * @param {Object} options
 * @param {number} [options.initialValue=0] - Valor inicial numérico.
 * @param {number} [options.max] - Valor máximo permitido.
 * @returns {Object} { value, displayValue, onChange, setValue }
 */
export default function useCurrencyInput({
  initialValue = 0,
  max = Infinity,
} = {}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e) => {
    // Suporta tanto evento quanto valor direto, caso necessário
    const inputValue = e.target ? e.target.value : e;

    // Remove tudo que não é dígito
    const onlyDigits = String(inputValue).replace(/\D/g, "");

    // Converte para float (divisão por 100 para centavos)
    const floatValue = parseFloat(onlyDigits) / 100;

    let newValue = floatValue;

    // Validação de máximo
    if (max !== undefined && max !== null && newValue > max) {
      newValue = max;
    }

    setValue(newValue);
  };

  return {
    value,
    displayValue: utils.formatMoney(value),
    onChange,
    setValue,
  };
}
