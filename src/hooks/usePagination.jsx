import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook para gerenciar paginação de dados locais com suporte opcional a URL.
 */
export function usePagination(data = [], initialItemsPerPage = 10, syncKey = null) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Se syncKey existe, tenta pegar da URL, senão usa 1
  const initialPage = syncKey ? Number(searchParams.get(syncKey)) || 1 : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const safeData = Array.isArray(data) ? data : [];
  const totalItems = safeData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Sincroniza estado interno se a URL mudar (ex: botão voltar do navegador)
  useEffect(() => {
    if (syncKey) {
      const pageFromUrl = Number(searchParams.get(syncKey)) || 1;
      if (pageFromUrl !== currentPage) {
        setCurrentPage(pageFromUrl);
      }
    }
  }, [searchParams, syncKey]);

  // Garante que a página atual nunca exceda o total de páginas ao filtrar/excluir
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      handlePageChange(totalPages);
    }
  }, [totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (syncKey) {
      setSearchParams((prev) => {
        prev.set(syncKey, pageNumber);
        return prev;
      }, { replace: true });
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newValue = Number(e.target.value);
    setItemsPerPage(newValue);
    handlePageChange(1);
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
