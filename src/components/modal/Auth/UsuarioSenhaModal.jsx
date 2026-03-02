import React from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";

export default function UsuarioSenhaModal({ show, onHide, user, onReset }) {
  return (
    <Modal show={show} onHide={onHide} size="md" centered backdrop={false}>
      <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
        <Row>
          <Modal.Title className="text-center">
            Deseja resetar a senha do usuário?
          </Modal.Title>
        </Row>
        <Row>
          <Modal.Title>{user?.nome}</Modal.Title>
        </Row>
        <Row className="mt-3">
          <Col className="d-flex gap-2">
            <Button variant="success" onClick={onReset}>
              Resetar
            </Button>
            <Button variant="danger" onClick={onHide}>
              Cancelar
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
