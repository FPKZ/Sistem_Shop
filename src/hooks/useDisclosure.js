import { useState, useCallback } from "react";

/**
 * Hook genérico para gerenciar controles de abertura/fechamento (Modals, Offcanvas, etc)
 * @param {boolean} initialState Estado inicial (default `false`)
 * @returns {[boolean, { open: () => void, close: () => void, toggle: () => void }]}
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return [isOpen, { open, close, toggle }];
}
