import React from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";

export default function UsuarioInfoModal({
  show,
  onHide,
  user,
  onChange,
  onSubmit,
}) {
  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header className="border-0 mb-0" closeButton>
        <Modal.Title>Editar Usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={onSubmit}>
          <Row className="g-4">
            <Form.Control
              type="hidden"
              name="id"
              value={user.id || ""}
              readOnly
            />
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Nome:</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={user.nome || ""}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={user.email || ""}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Permissão:</Form.Label>
                <Form.Select
                  name="cargo"
                  value={user.cargo || "User"}
                  onChange={onChange}
                  required
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button className="btn btn-roxo w-100" type="submit">
                Alterar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
