import { useState } from "react";

/**
 * Hook para gerenciar estado de loading de requisições ou ações genéricas em blocos independentes.
 * 
 * @example
 * const [isLoading, request] = useLoadRequest();
 * 
 * const handleSalvar = () => {
 *   request(async () => {
 *     await api.salvarDados();
 *   });
 * };
 * 
 * return <button onClick={handleSalvar} disabled={isLoading}>Salvar</button>;
 * 
 * @returns {Array} Array contendo [isLoading, requestFunction]
 */
export function useLoadRequest() {
  const [isLoading, setIsLoading] = useState(false);

  async function request(callback) {
    try {
      setIsLoading(true);
      await callback();
    } finally {
      setIsLoading(false);
    }
  }

  return [isLoading, request];
}
