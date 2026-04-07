import { useState } from "react";
import { useToast } from "@contexts/ToastContext";

/**
 * Hook para centralizar o tratamento de requisições API com feedback visual.
 * 
 * @example
 * const { isLoading, handleRequest } = useRequestHandler();
 * 
 * const salvar = async () => {
 *   await handleRequest(() => api.salvar(), { successMessage: "Salvo!" });
 * };
 * 
 * @returns {Object} { isLoading, handleRequest }
 */
export function useRequestHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  /**
   * Executa uma função assíncrona (chamada de API) e gerencia loading/toasts.
   * @param {Function} apiCall - Função que retorna uma Promise com a resposta da API.
   * @param {Object} options - Configurações opcionais.
   * @param {string} options.successMessage - Mensagem customizada de sucesso.
   * @param {string} options.errorMessage - Mensagem customizada de erro.
   * @param {boolean} options.showSuccessToast - Se deve mostrar toast de sucesso (default: true).
   * @param {boolean} options.showErrorToast - Se deve mostrar toast de erro (default: true).
   * @returns {Promise<Object|null>} A resposta da API ou null em caso de erro fatal.
   */
  const handleRequest = async (apiCall, options = {}) => {
    const {
      successMessage = null,
      errorMessage = null,
      showSuccessToast = true,
      showErrorToast = true,
    } = options;

    setIsLoading(true);
    try {
      const response = await apiCall();

      if (response && response.ok) {
        if (showSuccessToast) {
          showToast(
            successMessage ||
              response.message ||
              "Operação realizada com sucesso!",
            "success",
          );
        }
        return response;
      } else {
        if (showErrorToast) {
          showToast(
            errorMessage ||
              response?.message ||
              response?.error ||
              "Ocorreu um erro na operação.",
            "error",
          );
        }
        return response;
      }
    } catch (error) {
      console.error("Request Error:", error);
      if (showErrorToast) {
        showToast(errorMessage || "Erro de conexão com o servidor.", "error");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleRequest };
}
