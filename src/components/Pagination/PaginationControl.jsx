import React from "react";
import PaginationButtons from "./PaginationButtons";
import ItemsPerPageSelector from "./ItemsPerPageSelector";

/**
 * Componente completo de controle de paginação.
 *
 * @example
 * <PaginationControl
 *   currentPage={currentPage} // Página atual
 *   totalPages={totalPages} // Total de páginas
 *   onPageChange={handlePageChange} // Função para mudar de página
 *   itemsPerPage={itemsPerPage} // Quantidade de itens por página
 *   onItemsPerPageChange={handleItemsPerPageChange} // Função para mudar a quantidade de itens por página
 *   totalItems={totalItems} // Total de itens
 *   indexOfFirstItem={indexOfFirstItem} // Índice do primeiro item
 *   indexOfLastItem={indexOfLastItem} // Índice do último item
 * />
 */
const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
  className = "",
}) => {
  if (totalItems === 0) return null;

  return (
    <div
      className={`d-flex flex-column mt-3 gap-3 ${className}`}
    >
      <PaginationButtons
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <ItemsPerPageSelector
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        totalItems={totalItems}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
      />
    </div>
  );
};

export default PaginationControl;
