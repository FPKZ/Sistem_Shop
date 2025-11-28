import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Badge, ListGroup } from "react-bootstrap";
import {
  FileText,
  Calendar,
  DollarSign,
  Package,
  Printer,
  Hash,
  User,
  ShoppingBag,
} from "lucide-react";
import utils from "@app/utils";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";

const ModalDetailNota = ({ visible, onClose, selectNota, handleBuy, handlePrintCustom }) => {
  if (!selectNota) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pago":
        return { variant: "success", label: "Pago" };
      case "pendente":
        return { variant: "warning", label: "Pendente" };
      case "vencido":
        return { variant: "danger", label: "Vencido" };
      default:
        return { variant: "secondary", label: "Desconhecido" };
    }
  };

  const status = getStatusBadge(selectNota.status);

  // Logic for sorting items (kept from previous implementation)
  const InvoiceItemsList = ({ itens }) => {
    const camposFiltragem = ["status"];
    const { dadosProcessados, requisitarOrdenacao } = useFiltroOrdenacao(
      itens,
      camposFiltragem
    );

    useEffect(() => {
      requisitarOrdenacao("status");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log(dadosProcessados);

    return (
      <ListGroup
        variant="flush"
        className="small"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {dadosProcessados?.map((item, index) => (
          <ListGroup.Item
            key={item.id || index}
            className="d-flex justify-content-between align-items-center px-0"
          >
            <div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="light" text="dark" className="border">
                  ID: {item.id}
                </Badge>
                <span className="fw-semibold">{item.nome}</span>
              </div>
              <div className="mt-2">
                <span className="text-muted" style={{ fontSize: "0.85em" }}>
                  Marca: {item.marca}
                </span>
              </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-end gap-2">
              <Badge
                bg={
                  item.status === "Disponivel"
                    ? "success"
                    : (item.status === "Reservado" && "warning") ||
                      (item.status === "Vendido" && "danger")
                }
              >
                {utils.capitalize(item.status) || "desconhecido"}
              </Badge>
              <span className="fw-semibold text-end">
                {utils.formatMoney(item.valor_compra)}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Modal
      show={visible}
      onHide={onClose}
      size="lg"
      fullscreen="md-down"
      centered
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <FileText className="me-2 text-primary" size={24} />
          Detalhes da Nota
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4 pb-md-0">
        <Row className="g-4">
          <Col md={6}>
            <h6 className="text-muted mb-3 text-uppercase small fw-bold">
              Informações da Nota
            </h6>

            <div className="mb-3">
              <Row className="g-3">
                <Col xs={12} md={6}>
                  <label className="text-muted small d-block">Fornecedor</label>
                  <div className="d-flex align-items-center gap-2">
                    <User size={16} className="text-muted" />
                    <span className="fw-semibold fs-5">
                      {selectNota.fornecedor}
                    </span>
                  </div>
                </Col>
                <Col xs={12} md={12}>
                  <label className="text-muted small d-block">Código</label>
                  <div className="d-flex align-items-center gap-2">
                    <Hash size={16} className="text-muted" />
                    <span className="font-monospace">{selectNota.codigo}</span>
                  </div>
                </Col>
                <Col xs={6} md={12}>
                  <label className="text-muted small d-block">
                    Data de Emissão
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span>{utils.formatDate(selectNota.data)}</span>
                  </div>
                </Col>
                <Col xs={6} md={12} className="text-end text-md-start">
                  <label className="text-muted small d-block">
                    Data de Vencimento
                  </label>
                  <div className="d-flex justify-content-end justify-content-md-start align-items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span>
                      {utils.formatDate(selectNota.data_vencimento) || "N/A"}
                    </span>
                  </div>
                </Col>
                <Col xs={6} md={12} className="text-end text-md-start order-last order-md-0">
                  <label className="text-muted small d-block">Status</label>
                  <Badge bg={status.variant} pill>
                    {status.label}
                  </Badge>
                </Col>
                <Col xs={6} md={12} className="">
                  <label className="text-muted small d-block">Valor Total</label>
                  <div className="d-flex align-items-center gap-2">
                    <DollarSign size={16} className="text-success" />
                    <span className="fw-bold fs-5">
                      {utils.formatMoney(selectNota.valor_total)}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col md={6}>
            <h6 className="text-muted mb-3 text-uppercase small fw-bold">
              Itens da Nota
            </h6>

            <div className="d-flex align-items-center gap-2 mb-3">
              <Package size={20} className="text-primary" />
              <span className="fw-bold">{selectNota.quantidade} Produtos</span>
            </div>

            {selectNota.itensNota && selectNota.itensNota.length > 0 ? (
              <InvoiceItemsList itens={selectNota.itensNota} />
            ) : (
              <div className="text-center p-4 bg-light rounded-3 text-muted">
                <Package size={32} className="mb-2 opacity-50" />
                <p className="m-0 small">Nenhum item registrado</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => handlePrintCustom(selectNota)}>
            <Printer size={16} className="me-2" />
            Imprimir
          </Button>
          {selectNota.status === "pendente" && (
            <Button
              variant="success"
              onClick={() => {
                handleBuy(selectNota.id);
                onClose();
              }}
            >
              <DollarSign size={16} className="me-2" />
              Pagar
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetailNota;
