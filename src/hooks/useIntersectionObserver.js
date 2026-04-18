import { useEffect, useState } from "react";

/**
 * Hook genérico para detectar visibilidade de um elemento usando Intersection Observer
 * @param {React.RefObject} elementRef Referência ao elemento
 * @param {IntersectionObserverInit} options Opções do observer (threshold, rootMargin)
 * @returns {boolean} true se o elemento estiver visível
 */
export function useIntersectionObserver(elementRef, options = {}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isVisible;
}
