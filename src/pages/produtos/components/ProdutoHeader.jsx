import { LayoutGrid, LayoutList, ListFilter, Search } from "lucide-react";
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";

export function ProdutoHeader({
  filtro,
  setFiltro,
  order,
  requisitarOrdenacao,
  categoriasUnicas,
  viewMode,
  setViewMode,
  children,
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="mb-4 row d-flex flex-wrap gap-md-0 gap-sm-2 gap-2 p-0">
      <div className="d-flex justify-content-between align-items-center">
        <div className="h5 text-center fw-normal m-0">Produtos</div>
        <div className="d-flex gap-3 align-items-center">
          <div className="d-flex align-items-center position-relative">
            {/* Barra de Pesquisa Expansível */}
            {showSearch && (
              <Form.Control
                type="text"
                placeholder="Pesquisar produto..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                autoFocus
                className="me-2 shadow-sm"
                style={{
                  width: "200px",
                  transition: "width 0.3s ease-in-out",
                  borderRadius: "20px",
                }}
              />
            )}
            <Button
              size="sm"
              variant=""
              onClick={() => {
                if (showSearch && !filtro) {
                  setShowSearch(false);
                } else {
                  setShowSearch(true);
                }
              }}
              className="d-flex align-items-center justify-content-center p-1 rounded-circle border-0"
              style={{ width: "32px", height: "32px" }}
            >
              <Search
                size={15}
                color={
                  filtro || showSearch ? "var(--bs-primary)" : "currentColor"
                }
              />
            </Button>
          </div>
          <Dropdown>
            <style>{`
              .custom-dropdown-filter {
                  width: 260px !important;
                  min-width: 260px !important;
              }
            `}</style>
            <Dropdown.Toggle
              variant=""
              className="dropdown-toggle-hidden-arrow d-flex justify-content-center align-items-center"
            >
              <ListFilter size={15} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow p-3 custom-dropdown-filter">
              <div className="d-flex flex-column gap-3">
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    Filtrar Categoria
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="cursor-pointer w-100"
                  >
                    <option value="">Todas as Categorias</option>
                    {categoriasUnicas.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    Ordenar por
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    value={order.chave}
                    onChange={(e) => requisitarOrdenacao(e.target.value)}
                    className="cursor-pointer w-100"
                  >
                    <option value="id">ID</option>
                    <option value="nome">Nome do Produto</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <ButtonGroup>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "secondary" : "outline-secondary"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={15} />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "secondary" : "outline-secondary"}
              onClick={() => setViewMode("list")}
            >
              <LayoutList size={15} />
            </Button>
          </ButtonGroup>
          {children}
        </div>
      </div>
    </div>
  );
}
