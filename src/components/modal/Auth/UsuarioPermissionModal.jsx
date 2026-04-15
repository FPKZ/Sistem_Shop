import { Modal, Form, Row, Col, Button } from "react-bootstrap";

export default function UsuarioPermissionModal({ show, onHide, onSubmit, onChange, user }) {
    if (!user) return null;

    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header className="border-0 mb-0" closeButton>
                <Modal.Title>Alterar Permissão do Usuário: {user.nome}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <Form onSubmit={onSubmit}>
                    <Row className="g-4">
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Permissão:</Form.Label>
                                <Form.Select 
                                    name="cargo" 
                                    required 
                                    value={user.cargo || "vendedor"}
                                    onChange={onChange}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="gerente">Gerente</option>
                                    <option value="admin">Administrador</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Button className="btn btn-roxo w-100" type="submit">
                                Alterar Permissão
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}