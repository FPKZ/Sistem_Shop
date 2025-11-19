import { Modal, Row, Col, Button, Badge, Card, Alert } from "react-bootstrap";
import { DollarSign, Edit, Printer } from 'lucide-react';
import { useEffect } from "react";
import utils from "@app/utils";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";

// --- NOVO COMPONENTE PARA LISTAR OS ITENS ---
const InvoiceItems = ({ itens }) => {
  const camposFiltragem = ["status"];

  const {
    dadosProcessados,
    requisitarOrdenacao
  } = useFiltroOrdenacao(itens, camposFiltragem);

  useEffect(() => {
    // Ordena por 'status' assim que o componente é montado
    requisitarOrdenacao("status");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // A dependência vazia garante que isso rode apenas uma vez

  const getStatsItem = (status) => {
    switch (status) {
      case "Vendido":
        return "bg-danger-subtle";
      case "Reservado":
        return "bg-warning-subtle";
      default:
        return ""; // Para 'Disponível' ou outros status
    }
  };

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ minHeight: '0' }}>
      <h5 className="mb-3">Produtos na Nota</h5>

      {itens.length > 0 ? (
        <div style={{ overflowY: 'auto' }}>
          {/* Cabeçalho da Lista */}
          <Row className="d-none d-md-flex text-muted fw-bold px-0 py-2 m-0 bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <Col md={1} className="text-center">#id</Col>
            <Col md={4}>Produto</Col>
            <Col md={3} className="text-center">Marca</Col>
            <Col md={2} className="text-center">Qnt.</Col>
            <Col md={2} className="text-end">V. Produto</Col>
          </Row>

          {/* Lista de Itens */}
          {dadosProcessados?.map(item => (
            <Card key={item.id} className={`border-bottom py-2 px-2 my-2 overflow-hidden ${getStatsItem(item.status)}`}>
              <Card.Body>
                <Row className="align-items-center g-1">
                  <Col xs={3} md={1} className="mb-2 mb-md-0 text-end text-md-start order-2 order-md-0">
                    <span className="d-md-none fw-semibold small">#id: </span>
                    <span className="fw-bolder">{item.id}</span>
                  </Col>
                  <Col xs={9} md={4} className="mb-2 mb-md-0 order-0 order-md-0">
                    <span className="d-md-none text-muted small">Produto: </span>
                    <span>{item.nome}</span>
                  </Col>
                  <Col xs={6} md={0} className="text-start text-md-center order-5 d-md-none mb-2 mb-md-0">
                    <span className="d-md-none text-muted small">Status: </span>
                    <span>{item.status}</span>
                  </Col>
                  <Col xs={9} md={3} className="text-start text-md-center mb-2 mb-md-0 order-3 order-md-3">
                    <span className="d-md-none text-muted small">Marca: </span>
                    <span>{item.marca}</span>
                  </Col>
                  <Col xs={3} md={2} className="text-end text-md-center mb-2 mb-md-0 order-4">
                    <span className="d-md-none text-muted small">Qtd: </span>
                    <span>1</span>
                  </Col>
                  <Col xs={6} md={2} className="text-end text-md-end mb-2 mb-md-0 order-last">
                    <span className="d-md-none text-muted small">V. Compra: </span>
                    <span>{utils.formatMoney(item.valor_compra)}</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="alert-roxo text-center fs-5 fw-medium ms-1 me-4 mt-3 w-100">Nenhum Produto cadastrado!!!</Alert>
      )}
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DO MODAL ---
const InvoiceDetailModal = ({ visible, onClose, selectNota, mobile, handleBuy }) => {

  if (!selectNota) {
    return null; // Retorna null se não houver nota, evitando a chamada de hooks
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pago":
        return { variant: "success", label: "Pago" };
      case "pendente":
        return { variant: "warning", label: "Pendente" };
      case "vencido":
        return { variant: "danger", label: "Vencido" };
      default:
        return { variant: 'secondary', label: 'Desconhecido' };
    }
  };

  const status = getStatusBadge(selectNota.status);

  return (
    <Modal show={visible} onHide={onClose} size="xl" fullscreen="md-down" centered>
      <Modal.Header closeButton >
        <Modal.Title as="h5">Nota Fiscal #{selectNota.codigo}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-md-4 pb-0 pb-md-0 d-flex flex-column" style={{ maxHeight: `${mobile ? "100dvh" : "70dvh"}` }}>
        {/* Seção de Detalhes */}
        <Row className="gy-4 mb-4">
          <Col xs={8} md={6} lg={6} className="order-0">
            <p className="text-muted mb-1 small">Fornecedor</p>
            <p className="fw-medium mb-0">{selectNota.fornecedor}</p>
          </Col>
          <Col xs={2} md={3} lg={2} className="order-1 text-start">
            <p className="text-muted mb-1 small">Emissão</p>
            <p className="fw-medium mb-0">{utils.formatDate(selectNota.data)}</p>
          </Col>
          <Col xs={2} md={3} lg={2} className="order-2 text-end">
            <p className="text-muted mb-1 small">Vencimento</p>
            <p className="fw-medium mb-0">{utils.formatDate(selectNota.data_vencimento) || "N/A"}</p>
          </Col>
          <Col xs={3} md={2} lg={2} className="order-4 order-lg-3 text-end">
            <p className="text-muted mb-1 small">Qnt. Prod.</p>
            <p className="fw-medium mb-0">{selectNota.quantidade}</p>
          </Col>
          <Col xs={9} md={10} lg={8} className="order-3 order-lg-4">
            <p className="text-muted mb-1 small">Código da Nota</p>
            <p className="fw-medium mb-0">{selectNota.codigo}</p>
          </Col>
          <Col xs={6} md={6} lg={2} className="order-5">
            <p className="text-muted mb-1 small">Status</p>
            <Badge bg={status.variant} pill>{status.label}</Badge>
          </Col>
          <Col xs={6} md={6} lg={2} className="order-last text-end">
            <p className="text-muted mb-1 small">Valor Total</p>
            <p className="fw-bold mb-0">{utils.formatMoney(selectNota.valor_total)}</p>
          </Col>
        </Row>

        <hr className="my-md-4" />

        {/* Renderiza o novo componente apenas quando há itens */}
        {selectNota.itensNota && <InvoiceItems itens={selectNota.itensNota} />}

      </Modal.Body>

      {/* Rodapé do Modal */}
      <Modal.Footer className="bg-light justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        {/* <Button variant="outline-primary">
          <Edit size={16} className="me-2" />
          Editar Nota
        </Button> */}
        <div className="d-flex gap-2">
          <Button variant="primary">
            <Printer size={16} className="me-2" />
            Imprimir
          </Button>
          {selectNota.status === "pendente" && 
            <Button 
              variant="success"
              onClick={() => {
                handleBuy(selectNota.id)
                onClose()
                }}>
              <DollarSign size={16} />
              Pago
            </Button>
          }
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceDetailModal;
