import React from "react";
import PaginationButtons from "./PaginationButtons";
import ItemsPerPageSelector from "./ItemsPerPageSelector";

/**
 * Componente completo de controle de paginação.
 *
 * @example
 * <PaginationControl
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   itemsPerPage={itemsPerPage}
 *   onItemsPerPageChange={handleItemsPerPageChange}
 *   totalItems={totalItems}
 *   indexOfFirstItem={indexOfFirstItem}
 *   indexOfLastItem={indexOfLastItem}
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
