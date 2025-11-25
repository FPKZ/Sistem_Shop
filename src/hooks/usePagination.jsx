import { useState } from "react";

/**
 * Hook para gerenciar paginação de dados locais.
 *
 * @example
 * const {
 *   currentItems,
 *   currentPage,
 *   totalPages,
 *   itemsPerPage,
 *   handlePageChange,
 *   handleItemsPerPageChange,
 *   indexOfFirstItem,
 *   indexOfLastItem,
 *   totalItems
 * } = usePagination(todosOsDados, 10);
 *
 * @param {Array} data - Array com todos os dados a serem paginados
 * @param {number} initialItemsPerPage - Quantidade inicial de itens por página (padrão: 10)
 */
export function usePagination(data = [], initialItemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const safeData = Array.isArray(data) ? data : [];
  const totalItems = safeData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    currentItems,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
    handleItemsPerPageChange,
    setCurrentPage,
    setItemsPerPage,
  };
}
