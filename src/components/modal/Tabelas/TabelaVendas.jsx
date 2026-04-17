import { Row, Col, Button, Badge, Dropdown } from "react-bootstrap";
import utils from "@services/utils";
import { EyeIcon, CheckCircle, Printer, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { printPDF, getVendaConfig } from "@services/generatePDF";

export default function TabelaVendas({ vendas, onView }) {
  const navigate = useNavigate();

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
          Vendedor
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold text-center">
          Data
        </Col>
        <Col md={2} className="text-secondary small text-uppercase fw-bold text-center">
          Valor
        </Col>
        <Col md={1} className="text-secondary small text-uppercase fw-bold px-0 text-center">
          Status
        </Col>
        <Col
          md={1}
          className="text-secondary small text-uppercase fw-bold text-end px-1"
        >
          Ações
        </Col>
      </Row>

      {/* Body */}
      {vendas && vendas.length > 0 ? (
        vendas.map((venda) => (
          <Row
            key={venda.id}
            className="tabela-vendas-row align-items-center py-3 px-2 px-md-2 mb-2 border rounded g-2 hover:bg-zinc-100 transition cursor-pointer"
            onClick={() => onView(venda)}
          >
            {/* ID */}
            <Col
              xs={2}
              md={1}
              className="my-2 my-md-0 order-1 order-md-0 text-end text-md-start"
            >
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                ID:
              </span>
              <span className="fw-bold">#{venda.id}</span>
            </Col>

            {/* Cliente */}
            <Col xs={10} md={3} className="my-2 my-md-0 order-first order-md-0">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Cliente:
              </span>
              <span>{venda.cliente?.nome || "Cliente N/A"}</span>
            </Col>

            {/* Vendedor */}
            <Col xs={10} md={2} className="my-2 my-md-0 order-first order-md-0">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Vendedor:
              </span>
              <span>{venda.vendedor?.nome || "Vendedor N/A"}</span>
            </Col>

            {/* Data */}
            <Col
              xs={4}
              md={2}
              className="my-2 my-md-0 order-3 order-md-0 text-center"
            >
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Data:
              </span>
              <span>{utils.formatDate(venda.data_venda)}</span>
            </Col>

            {/* Valor */}
            <Col
              xs={4}
              md={2}
              className="my-2 my-md-0 order-4 order-md-0 text-end text-md-center"
            >
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Valor:
              </span>
              <span className="fw-bold text-dark">
                {utils.formatMoney(venda.valor_total)}
              </span>
            </Col>

            {/* Status */}
            <Col xs={4} md={1} className="my-2 my-md-0 order-2 order-md-0 text-center">
              <span className="d-md-none text-secondary small text-uppercase fw-bold me-2">
                Status:
              </span>
              <Badge bg={getStatusBadge(venda.status)} className="fw-normal">
                {utils.capitalize(venda.status)}
              </Badge>
            </Col>

            {/* Ações */}
            <Col
              xs={12}
              md={1}
              className="my-2 my-md-0 text-md-end order-last order-md-0 d-flex justify-content-md-end px-2"
            >
              <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="p-0 border-0 bg-transparent dropdown-toggle-no-caret"
                  id={`dropdown-venda-${venda.id}`}
                >
                  <MoreVertical size={20} className="text-secondary" />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="shadow-sm border-0">
                  <Dropdown.Item
                    onClick={() => onView(venda)}
                    className="d-flex align-items-center gap-2 py-2"
                  >
                    <EyeIcon size={16} className="text-info" />
                    <span>Visualizar</span>
                  </Dropdown.Item>

                  {venda.status === "pendente" && (
                    <Dropdown.Item
                      onClick={() =>
                        navigate(`/vendas/Nova-Venda?vendaId=${venda.id}`)
                      }
                      className="d-flex align-items-center gap-2 py-2 text-success"
                    >
                      <CheckCircle size={16} />
                      <span>Finalizar Reserva</span>
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    onClick={() => {
                      const configVenda = getVendaConfig(venda);
                      printPDF(configVenda);
                    }}
                    className="d-flex align-items-center gap-2 py-2"
                  >
                    <Printer size={16} className="text-secondary" />
                    <span>Imprimir Nota</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
