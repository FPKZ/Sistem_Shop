import React from "react";
import { Form } from "react-bootstrap";

const ItemsPerPageSelector = ({
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
  className = "",
}) => {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <span className="text-muted small">Itens por página:</span>
      <Form.Select
        size="sm"
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="rounded-4 shadow-sm"
        style={{ width: "80px", cursor: "pointer" }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </Form.Select>
      <span className="text-muted small">
        Mostrando {indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, totalItems)} de {totalItems}
      </span>
    </div>
  );
};

export default ItemsPerPageSelector;
