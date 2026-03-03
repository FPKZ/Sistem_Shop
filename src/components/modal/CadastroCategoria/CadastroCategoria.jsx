import { Button, Form, Modal, Row } from "react-bootstrap";
import { useCadastroCategoria } from "@hooks/categorias/useCadastroCategoria";
import Erros from "@components/Erros";

export default function CadastroCategoria({ visible, onClose }) {
  const {
    formValue,
    erros,
    validated,
    isLoading,
    handleChange,
    handleSubimit,
  } = useCadastroCategoria(onClose);

  return (
    <Modal show={visible} onHide={onClose}>
      <Form onSubmit={handleSubimit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar nova categoria!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className=" gap-3">
            <Form.Group>
              <Form.Label>Nome:</Form.Label>
              <Form.Control
                type="text"
                className={`form-control ${
                  validated ? (erros.nome ? "is-invalid" : "is-valid") : ""
                }`}
                name="nome"
                value={formValue.nome || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição:</Form.Label>
              <Form.Control
                type="text"
                className={`form-control ${
                  validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""
                }`}
                name="descricao"
                value={formValue.descricao || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Button
                variant="outline-secondary"
                className="btn btn-roxo w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Cadastrar"}
              </Button>
            </Form.Group>
          </Row>
        </Modal.Body>
      </Form>
      <Erros erros={erros} />
    </Modal>
  );
}
