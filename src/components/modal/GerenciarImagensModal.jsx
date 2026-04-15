import { Modal, Button, Row, Col, Card, Nav } from "react-bootstrap";
import DropZone from "@components/DropZone";
import { Image as ImageIcon, PlusCircle } from "lucide-react";

export default function GerenciarImagensModal({ 
  visible, 
  onClose, 
  imagens, 
  onRemove,
  activeTab = "galeria",
  onTabChange,
  imageUpload,
  mobile
}) {
  
  return (
    <Modal show={visible} onHide={onClose} size="xl" fullscreen={mobile} centered>
      <Modal.Header closeButton className="rounded-3 border-0">
        <Modal.Title>Gerenciar Imagens do Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "40rem" }} className="bg-white p-0 rounded-3 d-flex flex-column overflow-hidden">
        {/* Navegação de Abas Manual */}
        <Nav 
          variant="tabs" 
          activeKey={activeTab} 
          onSelect={(k) => onTabChange && onTabChange(k)}
          className="px-3 pt-2 bg-light border-bottom"
        >
          <Nav.Item>
            <Nav.Link eventKey="galeria" className="d-flex align-items-center gap-2 py-2 px-4 fw-medium border-bottom-0">
              <ImageIcon size={18} />
              <span>Galeria ({imagens?.length || 0})</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="adicionar" className="d-flex align-items-center gap-2 py-2 px-4 fw-medium border-bottom-0">
              <PlusCircle size={18} />
              <span>Adicionar Fotos</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Conteúdo Renderizado Condicionalmente (Garante Isolamento Total) */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {activeTab === "galeria" ? (
            <div className="p-3 flex-grow-1 overflow-y-auto custom-scrollbar animate-fade-in">
              {imagens && imagens.length > 0 ? (
                <Row className="g-3 m-0">
                  {imagens.map((url, index) => (
                    <Col xs={6} md={4} key={index}>
                      <Card className="h-100 shadow-sm border-0 position-relative animate-fade-in">
                        <div className="ratio ratio-1x1 overflow-hidden rounded-3 border">
                          <img
                            src={url}
                            alt={`Produto ${index + 1}`}
                            className="object-fit-cover w-100 h-100"
                          />
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm border-2 border-white d-flex align-items-center justify-content-center"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() => onRemove(url)}
                          title="Remover imagem"
                        >
                          <i className="bi bi-trash3-fill" style={{ fontSize: "14px" }}></i>
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5 text-muted h-100 d-flex flex-column align-items-center justify-content-center animate-fade-in">
                  <div className="bg-light rounded-circle d-inline-block p-4 mb-3 border border-dashed">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                  <p className="fw-medium">Nenhuma imagem adicionada ainda.</p>
                  <Button 
                    variant="roxo-light" 
                    size="sm" 
                    className="mt-2 rounded-pill px-4"
                    onClick={() => onTabChange("adicionar")}
                  >
                    Começar upload
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow-1 d-flex flex-column p-3 animate-fade-in">
              <DropZone 
                onFilesSelected={imageUpload.handlers.handleFileSelect}
                aceitos={imageUpload.tiposAceitos}
                tiposLabel={imageUpload.tiposLabel}
              />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
