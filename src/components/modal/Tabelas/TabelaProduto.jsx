import { Container, Card, Row, Col, Badge, Button } from "react-bootstrap";
import { Package, Edit } from "lucide-react";
import util from "@services/utils.js";
import { usePermissoes } from "@hooks/auth/usePermissoes";

export default function TabelaProdutos({
  // mobile,
  produto,
  setItemEstoque,
  onEditItem,
  width,
  custom,
  setmodalInfoProduto,
  active
}) {
  const { pode } = usePermissoes();
  if (!produto || produto === null || produto === undefined) return;
  return (
    <>
      <Col
        md={width}
        className={`order-2 order-md-1 m-0 p-0 d-flex flex-column h-100! ${custom}`}
      >
        <Row
          className="g-0 p-2 m-0  position-sticky top-0 align-items-center"
          style={{ zIndex: 1, fontSize: "0.75rem" }}
        >
          <Col xs={1} className="text-center">
            <strong>ID</strong>
          </Col>
          <Col xs={1} className="text-center">
            <strong>IMG</strong>
          </Col>
          <Col xs={pode("editarProduto") ? 3 : 4}>
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
          {pode("editarProduto") && (
            <Col xs={1} className="text-center">
              <strong>AÇÕES</strong>
            </Col>
          )}
        </Row>

        {produto.itemEstoque.length === 0 ? (
          <div className="text-center dashed d-flex flex-column align-items-center justify-content-center h-full!">
            <Package size={48} className="mb-2 opacity-60" />
            <p className="text-muted mb-0">Nenhum item cadastrado!</p>
          </div>
        ) : (
          <div
            className={`grow p-1 overflow-y-auto`}
          >
               <Produtos
                produtos={produto}
                setItemEstoque={setItemEstoque}
                onEditItem={onEditItem}
                setmodalInfoProduto={setmodalInfoProduto}
                active={active}
                pode={pode}
              />
          </div>
        )}
      </Col>
    </>
  );
}

function Produtos({ produtos, setItemEstoque, onEditItem, setmodalInfoProduto, active, pode }) {
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
          className={`alert p-0 m-0 transition-all duration-300 ease-in-out 
                      ${active === produto.id ? "opacity-60" : ""}
                      ${produto.status === "Disponivel" ? "alert-light" : ""}
                      ${produto.status === "Vendido" ? "alert-danger" : ""} 
                      ${produto.status === "Reservado" ? "alert-warning" : ""}`}
          onClick={() => {
            active !== produto.id && setItemEstoque?.(produto);
            active !== produto.id && setmodalInfoProduto?.(true);
          }}
          style={{ cursor: `${active === produto.id ? "default" : "pointer"}` }}
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
                  src={
                    produtos.img
                      ? produtos.img
                      : "assets/tube-spinner.svg"
                  }
                  alt={produto.nome}
                  className="img-fluid rounded border shadow-sm"
                  style={{
                    maxHeight: "32px",
                    width: "32px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col xs={pode("editarProduto") ? 3 : 4} className="ps-2 text-truncate fw-semibold">
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
              {pode("editarProduto") && (
                <Col xs={1} className="d-flex justify-content-center p-0">
                  <Button 
                    variant="none" 
                    size="sm" 
                    className="p-1 px-2 text-roxo hover:bg-roxo-subtle rounded-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditItem?.(produto);
                    }}
                  >
                    <Edit size={14} />
                  </Button>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
