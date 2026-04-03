import { useEffect, useRef } from "react";

/**
 * Hook para integrar botões nativos do aparelho (Voltar / Swipe do iOS) 
 * ao controle de modais e painéis da aplicação SPA, empurrando históricos sem
 * de fato trocar de página.
 * 
 * @example
 * // Exemplo simples de uso:
 * function MinhaLoja() {
 *   const [carrinhoAberto, setCarrinhoAberto] = useState(false);
 *   const [menuAberto, setMenuAberto] = useState(false);
 * 
 *   // Ordem importa: Se ambos estiverem abertos, ao clicar "Voltar" 
 *   // ele fecha primeiro o Carrinho, e no segundo clique fecha o Menu.
 *   useHistoryBack([
 *     { isOpen: carrinhoAberto, close: () => setCarrinhoAberto(false) },
 *     { isOpen: menuAberto, close: () => setMenuAberto(false) }
 *   ]);
 * 
 *   return <div> ... </div>
 * }
 * 
 * @param {Array<{ isOpen: boolean, close: function }>} states - Array ordendo por prioridade de fechamento.
 */
export function useHistoryBack(states) {
  // Derivamos uma string booleana para ser uma dependência saudável no useEffect
  const statusesStr = JSON.stringify(states.map(s => s.isOpen));
  const previousState = useRef(states.map(s => s.isOpen));
  
  // Guardamos as instâncias atualizadas das funções de close sem engatilhar o useEffect principal
  const statesRef = useRef(states);
  useEffect(() => {
    statesRef.current = states;
  });

  // Empurra um state fantasma pro navegador quando algo novo é aberto
  useEffect(() => {
    const currentStatuses = JSON.parse(statusesStr);
    const abriuAlgo = currentStatuses.some((isOpen, index) => !previousState.current[index] && isOpen);

    if (abriuAlgo) {
      window.history.pushState({ modal: "open" }, "");
    }

    previousState.current = currentStatuses;
  }, [statusesStr]);

  // Se o usuário clicar no Voltar nativo do aparelho, a gente fecha as telas em ordem
  useEffect(() => {
    const handlePopState = () => {
      // Usamos statesRef pra garantir que acessamos o valor correto mesmo dentro do event listener
      for (const state of statesRef.current) {
        if (state.isOpen) {
          state.close();
          return; // Para o loop pra fechar só 1 tela por vez
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []); // Vazio, pois tudo vem do Ref
}
