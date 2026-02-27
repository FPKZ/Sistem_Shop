import { Row, Col, Card, Dropdown } from "react-bootstrap";
import {
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export function ClienteList({
  clientes,
  order,
  requisitarOrdenacao,
  mobile,
  onShowDetails,
  onEditClient,
  onDeleteRequest,
}) {
  const renderSortIcon = (chave) => {
    if (order.chave !== chave) return null;
    return order.direcao === "desc" ? (
      <ArrowUp size={17} />
    ) : (
      <ArrowDown size={17} />
    );
  };

  const getHeaderClass = (chave, baseClass = "") => {
    return `${baseClass} ${order.chave === chave ? "fw-bold" : ""} d-flex gap-1`;
  };

  return (
    <Card className={`rounded-4 ${mobile ? "border-0 bg-transparent" : ""}`}>
      <Card.Header className="border-0 d-none d-md-block">
        <Row className="py-2">
          <Col xs={1}>
            <span
              className={getHeaderClass("id", "items-center")}
              onClick={() => requisitarOrdenacao("id")}
              style={{ cursor: "pointer" }}
            >
              Id {renderSortIcon("id")}
            </span>
          </Col>
          <Col md={4}>
            <span
              className={getHeaderClass("nome", "items-center")}
              onClick={() => requisitarOrdenacao("nome")}
              style={{ cursor: "pointer" }}
            >
              Nome {renderSortIcon("nome")}
            </span>
          </Col>
          <Col md={2}>Telefone</Col>
          <Col md={3}>Endereço</Col>
          <Col md={1} className="m-0 p-0 text-center">
            <span
              className={getHeaderClass("vendas", "items-center")}
              onClick={() => requisitarOrdenacao("vendas")}
              style={{ cursor: "pointer" }}
            >
              Vendas {renderSortIcon("vendas")}
            </span>
          </Col>
          <Col md={1}>Ações</Col>
        </Row>
      </Card.Header>
      <div className="list-container d-flex d-md-block flex-column gap-2">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className={`hover:bg-gray-100 transition cursor-pointer ${mobile ? "card rounded-3 overflow-hidden" : ""}`}
          >
            <Card.Body
              className={`${mobile ? "" : "border-top"}`}
              onClick={() => mobile && onShowDetails(cliente)}
            >
              <div
                className="position-absolute top-0 start-0 h-100 rounded-0 d-md-none"
                style={{
                  width: "0.2rem",
                  backgroundColor: `${cliente.vendas?.length > 0 ? "var(--bs-success)" : "var(--bs-secondary)"}`,
                }}
              ></div>
              <Row className="g-2">
                <Col
                  xs={2}
                  md={1}
                  className="fw-semibold fw-md-normal text-end text-md-start order-1 order-md-0"
                >
                  <span className="d-md-none">#</span>
                  <span>{cliente.id}</span>
                </Col>
                <Col xs={10} md={4} className="d-flex order-0">
                  <span className="d-md-none">Nome:</span>
                  <p className="text-truncate fw-semibold fw-md-normal m-0 ms-2">
                    {cliente.nome}
                  </p>
                </Col>
                <Col
                  xs={12}
                  md={2}
                  className="d-flex justify-content-between order-2"
                >
                  <span className="d-md-none">Telefone: </span>
                  <span className="text-muted">{cliente.telefone}</span>
                </Col>
                <Col
                  xs={12}
                  md={3}
                  className="d-flex justify-content-between d-none d-md-block order-3"
                >
                  <span className="d-md-none">Endereço: </span>
                  <p className="text-muted text-truncate m-0">
                    {cliente.endereco}
                  </p>
                </Col>
                <hr className="d-md-none order-4 my-2" />
                <Col
                  xs={12}
                  md={1}
                  className="d-flex d-md-block justify-content-between text-md-center fw-semibold fw-md-normal order-5"
                >
                  <span className="d-md-none">Vendas: </span>
                  <span>{cliente.vendas?.length || 0}</span>
                </Col>
                <Col
                  md={1}
                  className="text-center d-none d-md-block order-last"
                >
                  <Dropdown onClick={(e) => e.stopPropagation()} className="w-100 d-flex justify-content-center">
                    <Dropdown.Toggle
                      as="a"
                      variant="link"
                      className="dropdown-toggle-hidden-arrow text-muted p-0"
                      id={`dropdown-cliente-${cliente.id}`}
                    >
                      <MoreVertical size={20} style={{ cursor: "pointer" }} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" renderOnMount>
                      <Dropdown.Item onClick={() => onShowDetails(cliente)}>
                        <div className="d-flex align-items-center gap-2">
                          <Eye size={16} /> Sobre
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => onEditClient(cliente)}>
                        <div className="d-flex align-items-center gap-2">
                          <Edit size={16} /> Editar
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={() => onDeleteRequest(cliente)}
                        className="text-danger"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Trash2 size={16} /> Excluir
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </div>
        ))}
      </div>
    </Card>
  );
}
