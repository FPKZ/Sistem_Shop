import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Edit } from "lucide-react";
import useEditarProduto from "@hooks/produtos/useEditarProduto";
import { useCategorias } from "@services/api/produtos";

export default function EditarProdutoModal({ visible, onClose, produto }) {
  const { 
    formValue, 
    handleChange, 
    handleSubmit, 
    isLoading, 
  } = useEditarProduto(produto, () => onClose());

  const { data: categoriasResp } = useCategorias();
  const categorias = categoriasResp?.data || [];
  if (!visible) return null;

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2 text-roxo">
            <Edit size={24} /> Editar Produto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="editProdutoNome">
                <Form.Label className="fw-bold small text-uppercase text-muted">Nome do Produto</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formValue.nome}
                  onChange={handleChange}
                  placeholder="Ex: Solo Leveling"
                  className="rounded-3 shadow-sm"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="editProdutoCategoria">
                <Form.Label className="fw-bold small text-uppercase text-muted">Categoria</Form.Label>
                <Form.Select
                  name="categoria_id"
                  value={formValue.categoria_id || ""}
                  onChange={handleChange}
                  className="rounded-3 shadow-sm"
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categorias?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="editProdutoDescricao">
                <Form.Label className="fw-bold small text-uppercase text-muted">Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descricao"
                  value={formValue.descricao}
                  onChange={handleChange}
                  placeholder="Breve descrição do produto..."
                  className="rounded-3 shadow-sm"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light border-0">
          <Button variant="outline-secondary" onClick={onClose} className="px-4 rounded-pill">
            Cancelar
          </Button>
          <Button variant="roxo" type="submit" disabled={isLoading} className="px-5 rounded-pill shadow-sm">
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
