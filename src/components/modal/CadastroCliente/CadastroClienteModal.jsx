import { Form, Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useCadastroCliente } from "@hooks/clientes/useCadastroCliente";

export default function ModalCliente({ visible, onClose, clienteParaEditar }) {
  const {
    formValue,
    setFormValue,
    erros,
    validated,
    isLoading,
    handleChange,
    handleSubimit,
  } = useCadastroCliente(onClose, clienteParaEditar);

  useEffect(() => {
    if (clienteParaEditar && visible) {
      setFormValue(clienteParaEditar);
    } else if (!visible) {
      setFormValue({});
    }
  }, [clienteParaEditar, visible, setFormValue]);

  const isEditing = !!clienteParaEditar;

  return (
    <Modal show={visible} onHide={onClose}>
      <Form onSubmit={handleSubimit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Cliente" : "Cadastrar Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <input
                type="text"
                className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : ""}`}
                id="nome"
                name="nome"
                value={formValue.nome || ""}
                onChange={handleChange}
                placeholder="Nome"
                required
              />
            </Col>
            <Col md={12}>
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                className={`form-control ${validated && formValue.email ? (erros.email ? `is-invalid` : `is-valid`) : ""}`}
                id="email"
                name="email"
                value={formValue.email || ""}
                onChange={handleChange}
                placeholder="E-mail"
              />
            </Col>
            <Col md={12}>
              <label htmlFor="tell" className="form-label">
                Telefone
              </label>
              <input
                type="tel"
                className={`form-control ${validated ? (erros.telefone ? `is-invalid` : `is-valid`) : ""}`}
                id="tell"
                name="telefone"
                value={formValue.telefone || ""}
                onChange={handleChange}
                placeholder="Telefone"
                required
              />
            </Col>
            <Col md={12}>
              <label htmlFor="endereco" className="form-label">
                Endereço
              </label>
              <input
                type="text"
                className={`form-control`}
                id="endereco"
                name="endereco"
                value={formValue.endereco || ""}
                onChange={handleChange}
                placeholder="Endereco"
              />
            </Col>
            <Col md={12} className="mt-4">
              <Button
                className="btn btn-roxo w-100"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processando...
                  </>
                ) : isEditing ? (
                  "Salvar Alterações"
                ) : (
                  "Cadastrar Cliente"
                )}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
