import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import util from "@app/utils.js";

export default function TabelaProdutos({
  mobile,
  produto,
  setItemEstoque,
  width,
  custom,
  setmodalInfoProduto,
}) {
  if (!produto || produto === null || produto === undefined) return;
  return (
    <>
      <Col
        md={width}
        className={`order-1 m-0 p-0 d-flex flex-column border  ${custom} ${mobile ? "" : "h-100"}`}
      >
        <Row
          className="g-0 p-2 m-0 border-bottom position-sticky top-0 bg-light align-items-center"
          style={{ zIndex: 1, fontSize: "0.75rem" }}
        >
          <Col xs={1} className="text-center">
            <strong>ID</strong>
          </Col>
          <Col xs={1} className="text-center">
            <strong>IMG</strong>
          </Col>
          <Col xs={4}>
            <strong>NOME</strong>
          </Col>
          <Col xs={2}>
            <strong>COMPRA</strong>
          </Col>
          <Col xs={2}>
            <strong>VENDA</strong>
          </Col>
          <Col xs={2} className="text-center">
            <strong>STATUS</strong>
          </Col>
        </Row>

        <div
          className={`grow p-0 overflow-hidden ${mobile ? "" : "overflow-y-auto"}`}
        >
          <Produtos
            produtos={produto}
            setItemEstoque={setItemEstoque}
            setmodalInfoProduto={setmodalInfoProduto}
          />
        </div>
      </Col>
    </>
  );
}

function Produtos({ produtos, setItemEstoque, setmodalInfoProduto }) {
  if (!produtos) return;
  const itens = produtos.itemEstoque;

  const getStatusBadge = (status) => {
    const commonClasses = "px-2 py-1 rounded-pill small fw-bold";
    switch (status) {
      case "Disponivel":
        return (
          <Badge
            bg="success-subtle"
            className={`text-success border border-success-subtle ${commonClasses}`}
            style={{ fontSize: "0.6rem" }}
          >
            Livre
          </Badge>
        );
      case "Reservado":
        return (
          <Badge
            bg="warning-subtle"
            className={`text-warning border border-warning-subtle ${commonClasses}`}
            style={{ fontSize: "0.6rem" }}
          >
            Reser.
          </Badge>
        );
      case "Vendido":
        return (
          <Badge
            bg="danger-subtle"
            className={`text-danger border border-danger-subtle ${commonClasses}`}
            style={{ fontSize: "0.6rem" }}
          >
            Vendido
          </Badge>
        );
      default:
        return (
          <Badge
            bg="secondary-subtle"
            className={`text-secondary border border-secondary-subtle ${commonClasses}`}
            style={{ fontSize: "0.6rem" }}
          >
            {status?.substring(0, 4)}.
          </Badge>
        );
    }
  };

  return (
    <Container fluid className="d-flex flex-column p-1 m-0 gap-2">
      {itens?.map((produto) => (
        <Card
          key={produto.id}
          className={`alert p-0 m-0
                      ${produto.status === "Disponivel" ? "alert-light" : ""}
                      ${produto.status === "Vendido" ? "alert-danger" : ""} 
                      ${produto.status === "Reservado" ? "alert-warning" : ""}`}
          onClick={() => {
            setItemEstoque?.(produto);
            setmodalInfoProduto?.(true);
          }}
          style={{ cursor: "pointer" }}
        >
          <Card.Body className="p-0 overflow-hidden">
            <Row
              className="px-2 py-1 align-items-center h-100"
              style={{ fontSize: "0.8rem" }}
            >
              <Col xs={1} className="p-0 text-center fw-bold text-muted">
                {produto.id}
              </Col>
              <Col xs={1} className="p-1 d-flex justify-content-center">
                <img
                  src={produtos.img || "src/assets/tube-spinner.svg"}
                  alt={produto.nome}
                  className="img-fluid rounded border shadow-sm"
                  style={{
                    maxHeight: "32px",
                    width: "32px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={4} className="ps-2 text-truncate fw-semibold">
                {produto.nome}
              </Col>
              <Col xs={2} className="p-0 text-truncate text-muted">
                {util.formatMoney(produto.valor_compra)}
              </Col>
              <Col xs={2} className="p-0 text-truncate fw-bold text-roxo">
                {util.formatMoney(produto.valor_venda)}
              </Col>
              <Col xs={2} className="p-0 d-flex justify-content-center">
                {getStatusBadge(produto.status)}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
