import { useState } from "react";

/**
 * Hook genérico para gerenciamento de formulários com suporte a transformações e validações.
 * @param {Object} initialState - Valor inicial do formulário.
 * @param {Object} config - Configurações de transformers (máscaras) e validators.
 * @returns {Object} utilitários de formulário.
 */
export function useForm(initialState = {}, config = {}) {
  const [formValue, setFormValue] = useState(initialState);
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);

  const { transformers = {}, validators = {} } = config;

  /**
   * Manipulador universal de mudanças em campos de formulário.
   * @param {Event} e - Evento de mudança do input.
   */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let newValue = type === "file" ? files[0] : value;

    // Aplica transformações (como máscaras) se existirem para o campo
    if (transformers[name]) {
      newValue = transformers[name](newValue);
    } else if (name === "email" && typeof newValue === "string") {
      // Comportamento padrão para email
      newValue = newValue.trim();
    }

    setFormValue((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Limpa o erro do campo ao interagir (opcional, melhora UX)
    if (erros[name]) {
      setErros((prevErrs) => {
        const newErrs = { ...prevErrs };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  /**
   * Executa validações configuradas.
   * @returns {boolean} Se o formulário é válido.
   */
  const validate = () => {
    let newErrors = {};

    // Validação baseada na config de validators
    Object.keys(validators).forEach((field) => {
      const value = formValue[field];
      const error = validators[field](value, formValue);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErros(newErrors);
    setValidated(true);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Reseta o formulário para o estado inicial ou vazio.
   */
  const resetForm = (newState = initialState) => {
    setFormValue(newState);
    setErros({});
    setValidated(false);
  };

  return {
    formValue,
    setFormValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    validate,
    resetForm,
  };
}
