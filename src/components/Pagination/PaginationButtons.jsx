import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationButtons = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination
      className={`m-0 justify-content-center pagination-roxo ${className}`}
    >
      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {[...Array(totalPages)].map((_, idx) => {
        const page = idx + 1;
        // Lógica simples para mostrar páginas próximas
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Pagination.Item>
          );
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return <Pagination.Ellipsis key={page} disabled />;
        }
        return null;
      })}

      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default PaginationButtons;
