import { Modal, Row, Col, Button, Badge, Table } from "react-bootstrap";
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
    return { variant: 'success', label: 'Pago' };
  };

  const status = getStatusBadge(selectNota.status);

  return (
    <Modal show={visible} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Nota Fiscal #{selectNota.codigo}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Seção de Detalhes (sem alterações) */}
        <Row className="gy-4 mb-4">
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Fornecedor</p>
            <p className="fw-medium mb-0">{selectNota.fornecedor}</p>
          </Col>
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Data de Emissão</p>
            <p className="fw-medium mb-0">{utils.formatDate(selectNota.data)}</p>
          </Col>
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Quantidade de Itens</p>
            <p className="fw-medium mb-0">{selectNota.quantidade}</p>
          </Col>
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Código da Nota</p>
            <p className="fw-medium mb-0">{selectNota.codigo}</p>
          </Col>
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Status</p>
            <Badge bg={status.variant} pill>{status.label}</Badge>
          </Col>
          <Col md={6} lg={4}>
            <p className="text-muted mb-1 small">Valor Total</p>
            <p className="fw-bold mb-0">{utils.formatMoney(selectNota.valor_total)}</p>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Seção de Produtos (COM A ALTERAÇÃO) */}
        <div>
          <h5 className="mb-3">Produtos na Nota</h5>
          {/* 1. ADICIONE O CONTAINER COM SCROLL AQUI */}
          <div 
            className="table-responsive" 
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            <Table>
              <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>Produto</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-end">Valor de Compra</th>
                  <th className="text-end">Valor de Venda</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectNota.itensNota?.map(item => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td className="text-center">1</td>
                    <td className="text-end">{utils.formatMoney(item.valor_compra)}</td>
                    <td className="text-end">{utils.formatMoney(item.valor_venda)}</td>
                    <td className="text-end fw-medium">{utils.formatMoney(item.valor_compra)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
