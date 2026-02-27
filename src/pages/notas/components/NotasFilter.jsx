import {
  Row,
  Col,
  FormControl,
  ButtonGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Search, ArrowUpDown } from "lucide-react";

export function NotasFilter({
  mobile,
  setFiltro,
  activeFilter,
  handleBtnFilter,
  order,
  setOrdem,
}) {
  return (
    <Row className="mb-4 align-items-center">
      <Col md={12} className="mb-3 d-flex position-relative align-items-center">
        <FormControl
          type="text"
          placeholder="Digite sua busca..."
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Search size={15} className="position-absolute end-0 me-4 mt-2" />
      </Col>
      <Col xs={6} md={6} className="mb-0 mb-md-0 d-flex ">
        <ButtonGroup size={mobile ? "sm" : ""}>
          {["Todas", "Pago", "Pendente", "Vencido"].map((filter) => (
            <Button
              key={filter}
              variant={
                activeFilter === filter ? "primary" : "outline-secondary"
              }
              className={`fw-medium ${
                activeFilter === filter ? "btn-roxo" : "outline-secondary"
              }`}
              onClick={() => handleBtnFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </ButtonGroup>
      </Col>
      <Col xs={6} md={6} className=" d-flex justify-content-end gap-3">
        <Dropdown align={"end"}>
          <Dropdown.Toggle
            variant=""
            className="fw-medium dropdown-toggle-hidden-arrow align-items-end d-flex"
            id="dropdown-sort"
          >
            <span className="d-none d-md-inline">
              Ordenar por:{" "}
              {order.direcao === "asc" ? "Mais Recente" : "Mais Antigo"}
            </span>
            <ArrowUpDown size={16} className="ms-md-2" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            <Dropdown.Item href="#" onClick={() => setOrdem("asc")}>
              Mais Recente
            </Dropdown.Item>
            <Dropdown.Item href="#" onClick={() => setOrdem("desc")}>
              Mais Antigo
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
}
