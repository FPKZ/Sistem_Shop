import { useState, useMemo, useEffect } from "react";

/**
 * Hook para filtragem e ordenação de arrays de objetos.
 * 
 * ### Exemplo de Uso:
 * ```jsx
 * const { dadosProcessados, filtro, setFiltro, requisitarOrdenacao, order } = useFiltroOrdenacao(
 *   produtos, 
 *   ["nome", "categoria.nome", { path: "tags", subCampos: ["label"] }]
 * );
 * 
 * // No JSX:
 * <input value={filtro} onChange={(e) => setFiltro(e.target.value)} />
 * <button onClick={() => requisitarOrdenacao('preco')}>Ordenar por Preço</button>
 * <ul>
 *   {dadosProcessados.map(item => <li key={item.id}>{item.nome}</li>)}
 * </ul>
 * ```
 * 
 * @param {Array} dadosIniciais - Array de objetos a serem filtrados e ordenados.
 * @param {Array} camposFiltragem - Campos para busca. Aceita string (ex: "nome") ou objeto para arrays internos 
 *                                 (ex: { path: "lista", subCampos: ["nome"] }).
 * @param {Array} camposSeparacao - Campos para separação. Aceita string (ex: "nome") ou objeto para arrays internos 
 
 * @returns {Object} { filtro, setFiltro, order, dadosProcessados, setOrdem, requisitarOrdenacao }
 */
export const useFiltroOrdenacao = (dadosIniciais, camposFiltragem, camposSeparacao) => {
  const [filtroInput, setFiltroInput] = useState({});
  const [filtroDebounced, setFiltroDebounced] = useState({});
  const [order, setOrder] = useState({ chave: "id", direcao: "asc" });

  // Debounce para evitar processamento excessivo a cada tecla digitada
  useEffect(() => {
    const handler = setTimeout(() => {
      setFiltroDebounced(filtroInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [filtroInput]);

  // Processamento principal: Filtragem -> Ordenação
  const dadosProcessados = useMemo(() => {
    let dadosFiltrados = [...dadosIniciais];

    // Lógica de Filtragem
    if (filtroDebounced) {
      // Caso 1: Filtro por Objeto (Filtros específicos: { nome: "A", categoria: "B" })
      if (typeof filtroDebounced === "object" && !Array.isArray(filtroDebounced)) {
        Object.entries(filtroDebounced).forEach(([chave, valor]) => {
          if (valor) {
            const termoBusca = String(valor).toLowerCase();
            dadosFiltrados = dadosFiltrados.filter((item) => {
              // Busca o valor no item (suporta aninhamento como 'categoria.nome')
              const valorCampo = chave
                .split(".")
                .reduce((obj, key) => obj && obj[key], item);
              
              return (
                valorCampo !== null &&
                valorCampo !== undefined &&
                String(valorCampo).toLowerCase().includes(termoBusca)
              );
            });
          }
        });
      } 
      // Caso 2: Filtro por String (Busca Global em todos os 'camposFiltragem')
      else if (typeof filtroDebounced === "string" && filtroDebounced !== "") {
        const termoBusca = filtroDebounced.toLowerCase();

        dadosFiltrados = dadosFiltrados.filter((item) => {
          return camposFiltragem.some((campoConfig) => {
            // Caso 2.1: Campo simples ou aninhado via string (ex: "cliente.nome")
            if (typeof campoConfig === "string") {
              const valorCampo = campoConfig
                .split(".")
                .reduce((obj, key) => obj && obj[key], item);
              
              return (
                valorCampo !== null &&
                valorCampo !== undefined &&
                String(valorCampo).toLowerCase().includes(termoBusca)
              );
            }

            // Caso 2.2: Busca dentro de um Array de Objetos (ex: Item -> Estoque[] -> Cor)
            if (
              typeof campoConfig === "object" &&
              campoConfig.path &&
              Array.isArray(campoConfig.subCampos)
            ) {
              const valorArray = campoConfig.path
                .split(".")
                .reduce((obj, key) => obj && obj[key], item);

              if (Array.isArray(valorArray)) {
                return valorArray.some((subItem) => {
                  return campoConfig.subCampos.some((subCampo) => {
                    const valorSubCampo = subCampo
                      .split(".")
                      .reduce((obj, key) => obj && obj[key], subItem);
                    
                    return (
                      valorSubCampo !== null &&
                      valorSubCampo !== undefined &&
                      String(valorSubCampo).toLowerCase().includes(termoBusca)
                    );
                  });
                });
              }
            }
            return false;
          });
        });
      }
    }

    // Lógica de Ordenação
    dadosFiltrados.sort((a, b) => {
      // Prioridade 1: Disponibilidade (Esgotados sempre por último)
      const esgotadoA = a.quantidade === camposSeparacao;
      const esgotadoB = b.quantidade === camposSeparacao;

      if (esgotadoA && !esgotadoB) return 1;
      if (!esgotadoA && esgotadoB) return -1;

      // Prioridade 2: Ordenação Principal (definida pelo usuário)
      const valorA = a[order.chave];
      const valorB = b[order.chave];

      if (valorA < valorB) return order.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return order.direcao === "asc" ? 1 : -1;
      return 0;
    });

    return dadosFiltrados;
  }, [dadosIniciais, filtroDebounced, order, camposFiltragem]);

  /**
   * Altera a coluna de ordenação ou inverte a direção se for a mesma coluna.
   * @param {string} chave - Nome da propriedade para ordenar.
   */
  const requisitarOrdenacao = (chave) => {
    let direcao = "asc";
    if (order.chave === chave && order.direcao === "asc") {
      direcao = "desc";
    }
    setOrder({ chave, direcao });
  };

  /**
   * Ordena por uma chave específica.
   * @param {string} chave - Nome da propriedade para ordenar.
   * @param {'asc' | 'desc'} direcao - Direção da ordenação.
   */
  const ordenarPorChave = (chave, direcao) => {
    setOrder({ chave, direcao });
  };

  /**
   * Define manualmente a direção da ordenação para a coluna atual.
   * @param {'asc' | 'desc'} direcao 
   */
  const setOrdem = (direcao) => {
    const chave = order.chave;
    setOrder({ chave, direcao });
  };

  return {
    filtro: filtroInput,      // Valor atual do input (sem debounce)
    setFiltro: setFiltroInput, // Função para atualizar o input
    order,                    // Estado atual da ordenação { chave, direcao }
    dadosProcessados,         // Lista final filtrada e ordenada
    setOrdem,                 // Função para setar direção manualmente
    requisitarOrdenacao,      // Função principal para alternar ordenação
    ordenarPorChave,          // Função para ordenar por uma chave específica
  };
};


