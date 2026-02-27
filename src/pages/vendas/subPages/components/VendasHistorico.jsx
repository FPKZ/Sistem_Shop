import { Card, Form } from "react-bootstrap";
import TabelaVendas from "@tabelas/TabelaVendas";
import PaginationButtons from "@components/Pagination/PaginationButtons";

export function VendasHistorico({
  mobile,
  vendas,
  currentItems,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  handleViewVenda,
  paginate,
}) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="position-relative">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Histórico de Vendas</h5>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Exibir:</span>
            <Form.Select
              size="sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-4 text-center"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </div>
        </div>

        <TabelaVendas vendas={currentItems} onView={handleViewVenda} />

        <div
          className={
            mobile ? "" : "position-absolute bottom-0 end-0 w-full m-3"
          }
        >
          <div className="my-3 mb-4">
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
          <div className="d-flex justify-content-end align-items-end">
            <span className="text-muted small">
              Mostrando {currentItems.length} de {vendas.length} vendas
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
