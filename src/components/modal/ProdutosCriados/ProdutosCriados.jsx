import { Modal, Button, ListGroup, Badge, Form } from "react-bootstrap";
import { Package2, Copy, X } from "lucide-react";
import { useState, useEffect } from "react";
import "./ProdutosCriados.css"

export default function ProdutosCriados({ visible, onClose, itens }) {
  const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        if (visible) {
            setCheckedItems({});
        }
    }, [visible]);

  const displayItens = Array.isArray(itens) ? itens : itens ? [itens] : [];

  if (!visible || displayItens.length === 0) return null;

    const handleCheckChange = (id, isChecked) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: isChecked
        }));
    };

  const allChecked = displayItens.every((item) => checkedItems[item.id]);

  const handleSubimit = async (e) => {
    e.preventDefault();
    if (allChecked) {
      onClose();
    }
  };

    return (
    <Modal show={visible} onHide={onClose} centered size="lg">
      <Modal.Header className="d-flex justify-content-between">
                <Modal.Title as="h5" className="fw-bold">
                    Produtos Criados
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubimit}>
        <Modal.Body className="p-0 w-100 overflow-auto" style={{maxHeight: `calc(100dvh - 210px)`}}>
            <ListGroup variant="flush">
                    {displayItens.map((item) => (
                                <ListGroup.Item
                                    key={item.id}
                                    
                                    className="row d-flex justify-content-between align-items-center m-0 py-3 px-1"
                                >
                                    <div className="col-11 d-flex align-items-center gap-3">
                                        <div
                                            className="col-3 d-flex align-items-center justify-content-center rounded-3 bg-light"
                                            style={{ width: "48px", height: "48px" }}
                                        >
                                            <Package2 size={24} className="text-muted" />
                                        </div> 
                                        <div className="col-6 col-md-8 border-end pe-2">
                                            <p className="mb-0 fw-medium fs-5">
                                                ID: <Badge bg="secondary">{item.id || "N/A"}</Badge>
                                                <span className="mb-0 ms-2 text-muted fs-6 small">
                                                    Codigo: {item.codigo_barras || "0000000000000"}
                                                </span>
                                            </p>
                                            <p className="mb-0 text-muted fs-6 small">
                                                Nome: {item.nome || "Produto Exemplo"} 
                                            </p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <p className="mb-0 text-muted fs-6 small">
                                                Tamanho: {item.tamanho || "N/A"}
                                            </p>
                                            <p className="mb-0 text-muted fs-6 small">
                                                Marca:{" "}
                                                {item.marca || "Marca Famosa"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* <Button
                                        variant="light"
                                        size="sm"
                                        className="rounded-circle"
                                        title="Copiar ID"
                                        onClick={() => handleCopyId(item.id)}
                                    >
                                        <Copy size={16} />
                                    </Button> */}
                                    <div className="col-1 d-flex align-items-center justify-content-center p-0">
                                        <Form.Check 
                                            type="checkbox" 
                                            className="fs-4" 
                                            required 
                                            checked={!!checkedItems[item.id]}
                                            onChange={(e) => handleCheckChange(item.id, e.target.checked)}
                                        />
                                    </div>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="outline-secondary" 
                        type="submit" 
                        className="btn btn-roxo w-100"
                        disabled={!allChecked}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
