import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Hook para salvar a posição do scroll e restaurar quando modais/telas saírem da frente.
 *
 * ARQUITETURA:
 * O problema de scroll no Chrome Android na última página (com poucos itens) era causado
 * pelo layout encolhendo APÓS nosso scrollTo(0), tornando nossa posição inválida.
 * A solução arquitetural é garantir min-height:100dvh no container de produtos (Produtos.jsx),
 * para que o scrollMax nunca diminua abruptamente. Com isso, este hook pode ser simples.
 *
 * @param {boolean} isModalOpen - Define se algum modal está aberto
 * @param {React.MutableRefObject} topRef - Ref para elemento âncora no topo (deve ser position:fixed)
 * @param {Array} extraDeps  - Deps que RESETAM a memória de scroll e forçam scroll ao topo
 * @param {Array} triggerDeps - Deps que forçam scroll ao topo mas NÃO resetam a memória
 */
export function useScrollRestoration(isModalOpen, topRef, extraDeps = [], triggerDeps = []) {
  const scrollPosition = useRef(0);
  const scrollParent = useRef(null);
  const prevDeps = useRef(extraDeps);

  // Reset síncrono de memória quando extraDeps mudam (ex: troca de página)
  if (JSON.stringify(prevDeps.current) !== JSON.stringify(extraDeps)) {
    scrollPosition.current = 0;
    prevDeps.current = extraDeps;
  }

  // ─── Rastreia posição de scroll ───────────────────────────────────────────
  useEffect(() => {
    const handleScroll = (e) => {
      if (!isModalOpen) {
        const target = e.target;
        const top =
          target.scrollTop ??
          target.scrollingElement?.scrollTop ??
          target.documentElement?.scrollTop ??
          window.scrollY ??
          0;
        scrollPosition.current = top;
        scrollParent.current = target === document ? window : target;
      }
    };
    // Fase de captura para pegar eventos de qualquer elemento scrollável
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isModalOpen]);

  // ─── Reseta ou restaura o scroll ──────────────────────────────────────────
  // useLayoutEffect roda ANTES da tela piscar para o usuário, eliminando o delay.
  useLayoutEffect(() => {
    const goToTop = () => {
      // Tenta o scroller natural identificado
      const scroller = scrollParent.current || window;
      try { scroller.scrollTo({ top: 0, behavior: "instant" }); } catch { scroller.scrollTop = 0; }

      // Tenta explícito na window / dom (fallback seguro)
      try { window.scrollTo({ top: 0, behavior: "instant" }); } catch { /* silencia fallback */ }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // topRef como âncora via scrollIntoView
      topRef?.current?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const restoreScroll = (pos) => {
      const scroller = scrollParent.current || window;
      try { scroller.scrollTo({ top: pos, behavior: "instant" }); } catch { scroller.scrollTop = pos; }
    };

    const pos = scrollPosition.current;

    if (isModalOpen) {
      // Modal aberto — leva pro topo sem restaurar
      goToTop();
      return;
    }

    if (pos === 0) {
      // ── RESET DE PÁGINA / FILTRO ──
      // Executa em dois momentos:
      // 1. Imediatamente (antes do paint) — captura o scroll antes do reflow
      goToTop();

      // 2. Após o próximo ciclo de renderização — garante que o novo layout
      //    (mais curto na última página) já foi pintado e nosso scroll se mantém.
      //    Com min-height:100dvh no container, o scrollMax nunca encolhe,
      //    então este segundo disparo é sempre suficiente.
      const raf = requestAnimationFrame(() => {
        goToTop();

        // Terceiro disparo com delay extra para dispositivos lentos
        setTimeout(goToTop, 100);
      });

      return () => cancelAnimationFrame(raf);
    } else {
      // ── RESTAURAÇÃO (voltando de produto/carrinho) ──
      restoreScroll(pos);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, topRef, ...extraDeps, ...triggerDeps]);
}
