import { Modal, Button, Row, Col, Card } from "react-bootstrap";

export default function GerenciarImagensModal({ visible, onClose, imagens, onRemove }) {
  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar Imagens do Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70dvh", overflowY: "auto" }}>
        {imagens && imagens.length > 0 ? (
          <Row className="g-3">
            {imagens.map((url, index) => (
              <Col xs={6} md={4} key={index}>
                <Card className="h-100 shadow-sm border-0 position-relative group">
                  <div className="ratio ratio-1x1 overflow-hidden rounded">
                    <img
                      src={url}
                      alt={`Produto ${index + 1}`}
                      className="object-fit-cover w-100 h-100"
                    />
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px", opacity: 0.9 }}
                    onClick={() => onRemove(url)}
                    title="Remover imagem"
                  >
                    <i className="bi bi-x-lg" style={{ fontSize: "12px" }}></i>
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-images display-4 d-block mb-3"></i>
            <p>Nenhuma imagem adicionada ainda.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
