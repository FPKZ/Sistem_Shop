import { useEffect, useRef } from "react";

/**
 * Hook para salvar a posição do scroll de um container invisível 
 * e restaurar quando modais/telas saírem da frente.
 * 
 * @example
 * // Exemplo com paginação:
 * useScrollRestoration(modalAberto, topRef, [currentPage]);
 * 
 * @param {boolean} isModalOpen - Define se algum modal está aberto (pausando o rastreador e jogando o scroll pro topo)
 * @param {React.MutableRefObject} topRef - Ref para um elemento no topo, usado como fallback de scroll
 * @param {Array} extraDeps - Dependências que, ao mudar, forçam o scroll para o topo (ex: página atual)
 */
export function useScrollRestoration(isModalOpen, topRef, extraDeps = []) {
  const scrollPosition = useRef(0);
  const scrollParent = useRef(null);
  const prevDeps = useRef(extraDeps);

  // 1. Efeito de Reset: Deve vir antes do efeito de scroll para garantir que o valor seja 0
  // Usamos a mudança das dependências extras para "limpar" a posição salva.
  if (JSON.stringify(prevDeps.current) !== JSON.stringify(extraDeps)) {
    scrollPosition.current = 0;
    prevDeps.current = extraDeps;
  }

  // 2. Monitora o scroll de qualquer elemento da tela de forma invisível
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

  // 3. Restaura o scroll ou leva pro topo
  useEffect(() => {
    // Usamos requestAnimationFrame para garantir que o scroll aconteça 
    // APÓS o React terminar de renderizar os novos itens no DOM.
    const animationFrame = requestAnimationFrame(() => {
      const scroller = scrollParent.current || window;
      
      if (isModalOpen) {
        // Sobe ao topo se for um modal aberto
        if (scroller.scrollTo) scroller.scrollTo(0, 0);
        else scroller.scrollTop = 0;
        
        // Fallback robusto usando o ref do elemento de topo
        if (topRef?.current) {
          topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
        }
      } else {
        // Restaura a posição (será 0 se as extraDeps mudaram no render anterior)
        if (scroller.scrollTo) scroller.scrollTo(0, scrollPosition.current);
        else scroller.scrollTop = scrollPosition.current;

        // Garantia adicional agressiva para casos de mudança de página (scrollPosition resetado para 0)
        if (scrollPosition.current === 0) {
          window.scrollTo(0, 0);
          if (topRef?.current) {
            topRef.current.scrollIntoView({ behavior: "instant", block: "start" });
          }
        }
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isModalOpen, topRef, ...extraDeps]);
}
