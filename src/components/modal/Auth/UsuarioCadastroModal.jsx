import React from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";

export default function UsuarioCadastroModal({ show, onHide, onSubmit }) {
  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header className="border-0 mb-0" closeButton>
        <Modal.Title>Cadastrar Novo Usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={onSubmit}>
          <Row className="g-4">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Nome:</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  placeholder="João da Silva"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="joaoSilva@gmail.com"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Senha:</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  placeholder="mudar123"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Permissão:</Form.Label>
                <Form.Select name="cargo" required>
                  <option value="vendedor">Vendedor</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button className="btn btn-roxo w-100" type="submit">
                Cadastrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
