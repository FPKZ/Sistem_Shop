import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Hook para salvar a posição do scroll e restaurar condicionalmente.
 *
 * @param {boolean} isModalOpen - Define se algum modal está aberto
 * @param {React.MutableRefObject} topRef - Ref para elemento âncora no topo
 * @param {Array} extraDeps  - Deps que RESETAM a memória de scroll e forçam scroll ao topo
 * @param {Array} triggerDeps - Deps que forçam scroll ao topo mas NÃO resetam a memória
 * @param {string} persistenceKey - Chave para salvar no sessionStorage (opcional)
 * @param {React.MutableRefObject} containerRef - Ref para o container SCROLLÁVEL
 * @param {boolean} shouldRestore - Se falso, ignora a memória e limpa o cache
 */
export function useScrollRestoration(
  isModalOpen, 
  topRef, 
  extraDeps = [], 
  triggerDeps = [], 
  persistenceKey = null, 
  containerRef = null,
  shouldRestore = true
) {
  const getInitialPos = () => {
    if (persistenceKey && shouldRestore) {
      const saved = sessionStorage.getItem(`scroll_${persistenceKey}`);
      return saved ? Number(saved) : 0;
    }
    return 0;
  };

  const scrollPosition = useRef(getInitialPos());
  const scrollParent = useRef(null);
  const prevDeps = useRef(extraDeps);

  // Se shouldRestore for falso no carregamento, garantimos que a memória esteja limpa
  useLayoutEffect(() => {
    if (!shouldRestore) {
      scrollPosition.current = 0;
      if (persistenceKey) sessionStorage.removeItem(`scroll_${persistenceKey}`);
    }
  }, [shouldRestore, persistenceKey]);

  // Reset síncrono de memória quando extraDeps mudam (ex: troca de página)
  if (JSON.stringify(prevDeps.current) !== JSON.stringify(extraDeps)) {
    scrollPosition.current = 0;
    if (persistenceKey) sessionStorage.removeItem(`scroll_${persistenceKey}`);
    prevDeps.current = extraDeps;
  }

  // ─── Rastreia posição de scroll ───────────────────────────────────────────
  useEffect(() => {
    const handleScroll = (e) => {
      if (!isModalOpen) {
        if (containerRef && containerRef.current && e.target !== containerRef.current) return;

        const target = e.target;
        const top =
          target.scrollTop ??
          target.scrollingElement?.scrollTop ??
          target.documentElement?.scrollTop ??
          window.scrollY ??
          0;
        
        scrollPosition.current = top;
        scrollParent.current = target === document ? window : target;

        if (persistenceKey && top > 0) {
          sessionStorage.setItem(`scroll_${persistenceKey}`, top);
        }
      }
    };

    const targetEl = containerRef?.current || window;
    targetEl.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => targetEl.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isModalOpen, persistenceKey, containerRef]);

  // ─── Reseta ou restaura o scroll ──────────────────────────────────────────
  useLayoutEffect(() => {
    const scroller = containerRef?.current || scrollParent.current || window;

    const goToTop = () => {
      try { scroller.scrollTo({ top: 0, behavior: "instant" }); } catch { scroller.scrollTop = 0; }
      if (scroller === window) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      topRef?.current?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const restoreScroll = (pos) => {
      try { scroller.scrollTo({ top: pos, behavior: "instant" }); } catch { scroller.scrollTop = pos; }
    };

    const pos = shouldRestore ? scrollPosition.current : 0;

    if (isModalOpen) {
      goToTop();
      return;
    }

    if (pos === 0) {
      goToTop();
      const raf = requestAnimationFrame(() => {
        goToTop();
        setTimeout(goToTop, 100);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      restoreScroll(pos);
    }
  }, [isModalOpen, topRef, containerRef, shouldRestore, ...extraDeps, ...triggerDeps]);
}
