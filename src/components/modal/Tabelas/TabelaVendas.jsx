import { Row, Col, Button, Badge } from "react-bootstrap";
import utils from "@app/utils";
import { EyeIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function TabelaVendas({ vendas, onView }) {

  const { mobile } = useOutletContext();

  console.log(vendas);
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "concluida":
        return "success";
      case "pendente":
        return "warning";
      case "cancelada":
        return "danger";
      case "devolvida":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className=" d-flex flex-column gap-2">
      {/* Header - Only visible on desktop */}
      <Row className="tabela-vendas-header d-none d-md-flex bg-light py-2 px-3 mb-2 rounded">
        <Col md={1} className="text-secondary small text-uppercase fw-bold">
          ID
        </Col>
        <Col md={3} className="text-secondary small text-uppercase fw-bold">
          Cliente
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold">
          Data
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold">
          Valor
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold">
          Status
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold text-end">
          Ações
        </Col>
      </Row>

      {/* Body */}
      {vendas && vendas.length > 0 ? (
        vendas.map((venda) => (
          <Row
            key={venda.id}
            className="tabela-vendas-row align-items-center py-3 px-2 px-md-3 mb-2 border rounded g-2 hover:scale-105 transition cursor-pointer"
            onClick={() => onView(venda)}
          >
            {/* ID */}
            <Col xs={2} md={1} className="mb-2 mb-md-0 order-1 order-md-0 text-end text-md-start">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                ID:
              </span>
              <span className="fw-bold">#{venda.id}</span>
            </Col>

            {/* Cliente */}
            <Col xs={10} md={3} className="mb-2 mb-md-0 order-first order-md-0">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Cliente:
              </span>
              <span>{venda.cliente?.nome || "Cliente N/A"}</span>
            </Col>

            {/* Data */}
            <Col xs={4} md={2} className="mb-2 mb-md-0 order-3 order-md-0 text-center text-md-start">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Data:
              </span>
              <span>{utils.formatDate(venda.data_venda)}</span>
            </Col>

            {/* Valor */}
            <Col xs={4} md={2} className="mb-2 mb-md-0 order-4 order-md-0 text-end text-md-start">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Valor:
              </span>
              <span className="fw-bold text-dark">
                {utils.formatMoney(venda.valor_total)}
              </span>
            </Col>

            {/* Status */}
            <Col xs={4} md={2} className="mb-2 mb-md-0 order-2 order-md-0">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Status:
              </span>
              <Badge bg={getStatusBadge(venda.status)} className="fw-normal">
                {utils.capitalize(venda.status)}
              </Badge>
            </Col>

            {/* Ações */}
            <Col xs={12} md={2} className="text-md-end order-last order-md-0">
              <Button
                variant="light"
                size="sm"
                className={`text-info text-center btn-icon ${mobile ? "w-100" : ""}`}
                onClick={() => onView(venda)}
                title="Visualizar Detalhes"
              >
                <EyeIcon size={20} color="#00bfff" />
                <span className="d-md-none ms-2">Visualizar Detalhes</span>
              </Button>
            </Col>
          </Row>
        ))
      ) : (
        <Row>
          <Col className="text-center py-4 text-muted">
            Nenhuma venda encontrada.
          </Col>
        </Row>
      )}
    </div>
  );
}
