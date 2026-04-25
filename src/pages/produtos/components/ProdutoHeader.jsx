import { LayoutGrid, LayoutList, ListFilter, Search } from "lucide-react";
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import { isObject } from "framer-motion";
import { useOutletContext } from "react-router-dom";

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
  const { mobile } = useOutletContext();

  
  return (
    <div className="mb-4 row d-flex flex-wrap gap-md-0 gap-sm-2 gap-2 p-0 mt-2 mt-md-0">
      <div className="d-flex justify-content-between align-items-center">
        <div className={`h5 text-center fw-normal m-0 ${mobile ? "d-none" : ""}`}>Produtos</div>
        <div className={`d-flex ${mobile ? "flex-column w-100" : ""} gap-3 align-items-center`}>
          <div className={`d-flex align-items-center position-relative w-100 ${mobile ? "order-0 " : ""}`}>
            {/* Barra de Pesquisa Expansível */}
            {(mobile || showSearch) && (
              <Form.Control
                type="text"
                placeholder="Pesquisar produto..."
                value={isObject(filtro) ? "" : filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="me-2 shadow-sm rounded-pill w-100!"
              />
            )}
            <Button
              size="sm"
              variant=""
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) {
                  setFiltro("");
                }
              }}
              disabled={mobile}
              className={`d-flex align-items-center justify-content-center p-1 rounded-circle border-0 icon-btn-sm ${mobile ? "absolute right-2" : ""}`}
            >
              <Search
                size={15}
                color={
                  filtro || showSearch ? "var(--bs-secondary)" : "currentColor"
                }
              />
            </Button>
          </div>
          <div className={`d-flex ${mobile ? "justify-content-between w-100" : " gap-3"}`}>
            <Dropdown>
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
    </div>
  );
}
