import { useEffect, useRef } from "react";

/**
 * Hook para salvar a posição do scroll de um container invisível 
 * e restaurar quando modais/telas saírem da frente.
 * 
 * @example
 * // Exemplo simples de uso:
 * function Catalogo() {
 *   const [modalAberto, setModalAberto] = useState(false);
 *   const topRef = useRef(null);
 * 
 *   useScrollRestoration(modalAberto, topRef);
 * 
 *   return (
 *     <div ref={topRef} className="container">
 *        {modalAberto ? <Modal /> : <ListaDeRoupas />}
 *     </div>
 *   )
 * }
 * 
 * @param {boolean} isModalOpen - Define se algum modal está aberto (pausando o rastreador e jogando o scroll pro topo)
 * @param {React.MutableRefObject} topRef - Ref para um elemento no topo, usado como fallback de scroll
 */
export function useScrollRestoration(isModalOpen, topRef) {
  const scrollPosition = useRef(0);
  const scrollParent = useRef(null);

  // Monitora o scroll de qualquer elemento da tela de forma invisível
  useEffect(() => {
    const handleScroll = (e) => {
      // Quando não há modal aberto, gravamos de onde veio o scroll
      if (!isModalOpen) {
        const target = e.target;
        const top = target.scrollTop || target.scrollingElement?.scrollTop || target.documentElement?.scrollTop || window.scrollY || 0;
        
        scrollPosition.current = top;
        // Salva quem realmente é a caixa de rolagem (Root, container, etc)
        scrollParent.current = target === document ? window : target;
      }
    };
    
    // O 'true' comanda a fase de captura para podermos ouvir DIVs com overflow interno
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isModalOpen]);

  // Restaura o scroll ou leva pro topo
  useEffect(() => {
    const scroller = scrollParent.current || window;
    
    if (isModalOpen) {
      if (scroller.scrollTo) scroller.scrollTo(0, 0);
      else scroller.scrollTop = 0;
      
      // Fallback robusto
      if (topRef?.current) {
        topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
      }
    } else {
      if (scroller.scrollTo) scroller.scrollTo(0, scrollPosition.current);
      else scroller.scrollTop = scrollPosition.current;
    }
  }, [isModalOpen, topRef]);
}
