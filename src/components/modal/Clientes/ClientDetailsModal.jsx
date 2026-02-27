import React from "react";
import { Modal, Button, Row, Col, Badge, ListGroup } from "react-bootstrap";
import {
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Mail,
  Hash,
  Calendar,
} from "lucide-react";

import utils from "../../../app/utils";

const ClientDetailsModal = ({ show, onHide, cliente }) => {
  if (!cliente) return null;
  console.log(cliente);
  return (
    <Modal show={show} onHide={onHide} size="lg" fullscreen="md-down" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <User className="me-2 text-primary" size={24} />
          Detalhes do Cliente
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4" style={{ overflowY: "auto" }}>
        <Row className="g-4">
          <Col md={6}>
            <h6 className="text-muted mb-3 text-uppercase small fw-bold">
              Informações Pessoais
            </h6>

            <div className="mb-3">
              <label className="text-muted small d-block">Nome Completo</label>
              <span className="fw-semibold fs-5">{cliente.nome}</span>
            </div>

            <div className="mb-3">
              <label className="text-muted small d-block">ID do Cliente</label>
              <div className="d-flex align-items-center gap-2">
                <Hash size={16} className="text-muted" />
                <span className="font-monospace">{cliente.id}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-muted small d-block">Email</label>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-muted" />
                <span>{cliente.email || "Não informado"}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-muted small d-block">Telefone</label>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-muted" />
                <span>{cliente.telefone || "Não informado"}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-muted small d-block">Endereço</label>
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-muted" />
                <span>{cliente.endereco || "Não informado"}</span>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <h6 className="text-muted mb-3 text-uppercase small fw-bold">
              Histórico de Vendas
            </h6>

            <div className="d-flex align-items-center gap-2 mb-3">
              <ShoppingBag size={20} className="text-primary" />
              <span className="fw-bold">
                {cliente.vendas?.length || 0} Vendas Realizadas
              </span>
            </div>

            {cliente.vendas && cliente.vendas.length > 0 ? (
              <ListGroup
                variant="flush"
                className="small"
                style={{ maxHeight: "325px", overflowY: "auto" }}
              >
                {cliente.vendas.map((venda, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center px-1 mx-1"
                  >
                    <div>
                      <span className="fw-semibold me-3">
                        Venda #{venda.id || index + 1}
                      </span>
                      <Badge
                        bg={
                          venda.status === "concluida"
                            ? "success"
                            : venda.status === "pendente"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {utils.capitalize(venda.status) || "desconhecido"}
                      </Badge>
                      <br />
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.85em" }}
                      >
                        {venda.data_venda
                          ? utils.formatDate(venda.data_venda)
                          : "Data não disponível"}
                      </span>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2">
                      <Badge
                        bg="light"
                        text="dark"
                        className="border"
                        style={{ cursor: "pointer" }}
                      >
                        Ver detalhes
                      </Badge>
                      <span className="fw-semibold text-end">
                        {venda.total
                          ? `R$ ${venda.total}`
                          : "Valor não disponível"}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center p-4 bg-light rounded-3 text-muted">
                <ShoppingBag size={32} className="mb-2 opacity-50" />
                <p className="m-0 small">Nenhuma venda registrada</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      {/* <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default ClientDetailsModal;
