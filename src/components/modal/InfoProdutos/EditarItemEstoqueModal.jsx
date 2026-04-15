import { Modal, Form, Button, Row, Col, Dropdown, InputGroup } from "react-bootstrap";
import { Edit, Package, Layers, Palette, Barcode, DollarSign, Activity } from "lucide-react";
import { useCores } from "@services/api/produtos";
import { Cores } from "@components/Cores";
import useEditarItemEstoque from "@hooks/produtos/useEditarItemEstoque";

export default function EditarItemEstoqueModal({ visible, onClose, item }) {
    const { data: coresResp } = useCores();
    const cores = coresResp?.data || [];

    const {
        formValue,
        handleChange,
        erros,
        validated,
        pricing,
        isLoading,
        handleSubmit
    } = useEditarItemEstoque(item, visible, () => onClose());

    const { valorCompra, valorVenda, lucro, handlers } = pricing;

    if (!visible) return null;

    return (
        <Modal show={visible} onHide={onClose} size="lg" centered>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="d-flex align-items-center gap-2 text-roxo">
                        <Edit size={24} /> Editar Item de Estoque (ID: {item?.id})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">
                                    <Package size={14} className="me-1" /> Marca
                                </Form.Label>
                                <Form.Control
                                    name="marca"
                                    value={formValue.marca}
                                    onChange={handleChange}
                                    isInvalid={!!erros.marca}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{erros.marca}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">
                                    <Layers size={14} className="me-1" /> Tamanho
                                </Form.Label>
                                <Form.Control
                                    name="tamanho"
                                    value={formValue.tamanho}
                                    onChange={handleChange}
                                    isInvalid={!!erros.tamanho}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{erros.tamanho}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">
                                    <Palette size={14} className="me-1" /> Cor
                                </Form.Label>
                                <Dropdown className="w-100">
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        className="w-100 d-flex align-items-center justify-content-between rounded-3"
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                className="rounded-circle border shadow-sm"
                                                style={{
                                                    width: "1.2rem",
                                                    height: "1.2rem",
                                                    backgroundColor: formValue.cor || "#fff",
                                                }}
                                            />
                                            <span className="small">{formValue.cor || "Sem Cor"}</span>
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="shadow border-0 p-0" style={{ minWidth: '250px' }}>
                                        <Cores cores={cores} formValue={formValue} handleChange={handleChange} />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Col>

                        <Col md={8}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">
                                    <Barcode size={14} className="me-1" /> Código de Barras
                                </Form.Label>
                                <Form.Control
                                    name="codigo_barras"
                                    value={formValue.codigo_barras}
                                    onChange={handleChange}
                                    isInvalid={!!erros.codigo_barras}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{erros.codigo_barras}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <hr className="my-2 opacity-10" />
                        <h6 className="fw-bold text-roxo mb-0 mt-2">
                            <DollarSign size={16} className="me-1" /> Financeiro
                        </h6>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">Custo de Compra</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>R$</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={valorCompra.displayValue}
                                        onChange={handlers.handleValorCompraChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">Preço de Venda</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>R$</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        value={valorVenda.displayValue}
                                        onChange={handlers.handleValorVendaChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold small text-uppercase text-muted">Lucro Bruto</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-success-subtle text-success border-success-subtle">R$</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        readOnly
                                        className="bg-success-subtle text-success border-success-subtle fw-bold"
                                        value={lucro.displayValue}
                                    />
                                </InputGroup>
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
