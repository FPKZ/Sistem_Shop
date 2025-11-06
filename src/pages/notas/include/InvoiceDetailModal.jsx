import { Modal, Row, Col, Button, Badge, Table, Card, Alert } from "react-bootstrap";
import { X, Edit, Printer } from 'lucide-react';
import utils from "@app/utils"; // Importando suas funções utilitárias

const InvoiceDetailModal = ({ visible, onClose, selectNota }) => {
  // Se não houver nota selecionada, não renderize nada.
  if (!selectNota) {
    return null;
  }

  // Mapeia o status para a cor do Badge (exemplo, ajuste conforme necessário)
  const getStatusBadge = (status) => {
    // Você pode expandir essa lógica baseada no status real da nota

    switch (status){
      case "pago":
        return { variant: "success", label: "Pago"}
      case "pendente":
        return { variant: "warning", label: "Pendente"}
      case "vencido":
        return { variant: "danger", label: "Vencido"}
      default:
        return { variant: 'secondary', label: 'Desconhecido' }   
    }
  };

  const getStatsItem = (status) => {
    switch (status){
      case "Vendido":
        return "bg-danger-subtle"
      case "Reservado":
        return "bg-warning-subtle"
      default:
        return ""
    }
  }

  const status = getStatusBadge(selectNota.status);

  return (
    <Modal show={visible} onHide={onClose} size="xl" fullscreen="md-down" centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Nota Fiscal #{selectNota.codigo}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-md-4">
        {/* Seção de Detalhes (sem alterações) */}
        <Row className="gy-4 mb-4">
          <Col xs={6} md={6} lg={4}>
            <p className="text-muted mb-1 small">Fornecedor</p>
            <p className="fw-medium mb-0">{selectNota.fornecedor}</p>
          </Col>
          <Col xs={3} md={6} lg={4}>
            <p className="text-muted mb-1 small">Data de Emissão</p>
            <p className="fw-medium mb-0">{utils.formatDate(selectNota.data)}</p>
          </Col>
          <Col xs={3} md={6} lg={4}>
            <p className="text-muted mb-1 small">Quantidade de Itens</p>
            <p className="fw-medium mb-0">{selectNota.quantidade}</p>
          </Col>
          <Col xs={6} md={6} lg={4}>
            <p className="text-muted mb-1 small">Código da Nota</p>
            <p className="fw-medium mb-0">{selectNota.codigo}</p>
          </Col>
          <Col xs={3} md={6} lg={4}>
            <p className="text-muted mb-1 small">Status</p>
            <Badge bg={status.variant} pill>{status.label}</Badge>
          </Col>
          <Col xs={3} md={6} lg={4}>
            <p className="text-muted mb-1 small">Valor Total</p>
            <p className="fw-bold mb-0">{utils.formatMoney(selectNota.valor_total)}</p>
          </Col>
        </Row>

        <hr className="my-md-4" />

        {/* Seção de Produtos (COM A ALTERAÇÃO) */}
        {/* Seção de Produtos */}
        <div>
          <h5 className="mb-3">Produtos na Nota</h5>
          
          {/* Cabeçalho da Lista (visível em telas maiores) */}
          <Row className="d-none d-md-flex text-muted fw-bold mb-2 px-2 bg-light py-2 rounded-top me-3" style={{ position: 'sticky', top: 0, zIndex: 1, marginLeft: "0.1rem" }}>
            <Col md={1}>#id</Col>
            <Col md={3}>Produto</Col>
            <Col md={2} className="text-center">Quantidade</Col>
            <Col md={2} className="text-end">V. Compra</Col>
            <Col md={2} className="text-end">V. Venda</Col>
            <Col md={2} className="text-end">Total</Col>
          </Row>

          {/* Container com Scroll para a Lista de Itens */}
          {selectNota.itensNota.length > 0 ? (
            <div style={{ maxHeight: '40dvh', overflowY: 'auto' }}>
              {selectNota.itensNota?.map(item => (
                <Card key={item.id} className={`border-bottom py-2 px-2 my-2 overflow-hidden ${getStatsItem(item.status)}`}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={2} md={1} className="mb-2 mb-md-0 text-end text-md-start ">
                        <span className="d-md-none fw-semibold small">#id: </span>
                        <span className="fw-bolder">{item.id}</span>
                      </Col>
                      <Col xs={10} md={3} className="mb-2 mb-md-0 order-first order-md-0">
                        <span className="d-md-none text-muted small">Produto: </span>
                        <span>{item.nome}</span>
                      </Col>
                      <Col xs={6} md={2} className="text-md-center mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Qtd: </span>
                        <span>1</span>
                      </Col>
                      <Col xs={6} md={2} className="text-end text-md-center d-md-none mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Status: </span>
                        <span>{item.status}</span>
                      </Col>
                      <Col xs={4} md={2} className="text-start text-md-end mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">V. Compra: </span>
                        <span>{utils.formatMoney(item.valor_compra)}</span>
                      </Col>
                      <Col xs={4} md={2} className="text-end mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">V. Venda: </span>
                        <span>{utils.formatMoney(item.valor_venda)}</span>
                      </Col>
                      <Col xs={4} md={2} className="text-end fw-medium">
                        <span className="d-md-none text-muted small">Total: </span>
                        <span>{utils.formatMoney(item.valor_compra)}</span>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Alert className="alert-roxo text-center fs-5 fw-medium ms-1 me-4 mt-3">Nenhum Produto cadastrado!!!</Alert>
          )}
        </div>

      </Modal.Body>

      {/* Rodapé do Modal (sem alterações) */}
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="outline-primary">
          <Edit size={16} className="me-2" />
          Editar Nota
        </Button>
        <Button variant="primary">
          <Printer size={16} className="me-2" />
          Imprimir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceDetailModal;
