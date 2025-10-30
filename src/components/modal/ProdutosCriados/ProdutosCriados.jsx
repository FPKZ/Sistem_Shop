import { Modal, Button, ListGroup, Badge, Form } from "react-bootstrap"
import { Package2, Copy, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ProdutosCriados.css"

export default function ProdutosCriados({visible, onClose, itens}){
    if(!visible || !itens && itens.lenght === 0) return

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate()

    console.log(itens)
    // const handleCopyId = (id) => {
    //     navigator.clipboard.writeText(id);
    //     // Opcional: Adicionar um toast/notificação para feedback ao usuário
    // };

    const handleSubimit = async (e) => {
        e.preventDefault()
        navigate(-1)
        onClose()
    }

    return (
        <Modal show={visible} onHide={onClose} centered size="lg" >
            <Modal.Header className="d-flex justify-content-between">
                <Modal.Title as="h5" className="fw-bold">
                    Produtos Criados
                </Modal.Title>
                <Button
                    variant="link"
                    className="p-1.5 rounded-circle text-secondary"
                    onClick={onClose}
                >
                    <X size={24} />
                </Button>
            </Modal.Header>
            <Form onSubmit={handleSubimit}>
                <Modal.Body className="p-0 w-100 overflow-auto" style={{maxHeight: `calc(100dvh - 210px)`}}>
                    <ListGroup variant="flush">
                            {itens.map((item) => (
                                <ListGroup.Item
                                    key={item.id}
                                    
                                    className="d-flex justify-content-between align-items-center p-3"
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-3 bg-light"
                                            style={{ width: "48px", height: "48px" }}
                                        >
                                            <Package2 size={24} className="text-muted" />
                                        </div>
                                        <div>
                                            <p className="mb-0 fw-medium fs-5">
                                                ID: <Badge bg="secondary">{item.id || "N/A"}</Badge>
                                            </p>
                                            <p className="mb-0 text-muted fs-6 small">
                                                Nome: {item.nome || "Produto Exemplo"}  |  Marca:{" "}
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
                                    <Form.Check type="checkbox" className="fs-4" required />
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" className="btn btn-roxo w-100">Confirm</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
    // return (
    //     <Modal show={visible} onHide={onClose} centered>
    //         <Modal.Header closeButton>
    //             <Modal.Title>Produtos cadastrados / IDs</Modal.Title>
    //         </Modal.Header>
    //         <Modal.Body className="p-0 gap-3">
                
    //             {itens.map(iten => (
    //                 <Row className="d-flex m-0 p-3">
                        
    //                     <Card key={iten.id} className="console-id">
    //                             <strong>{iten.id || 1}</strong>
    //                     </Card>

    //                     <span>
    //                         <strong>Codigo de barras: </strong> {iten.codigo_barras}
    //                     </span>
    //                     <span>
    //                         <strong>Codigo de barras: </strong> {iten.codigo_barras}
    //                     </span>
    //                     <span>
    //                         <strong>Codigo de barras: </strong> {iten.codigo_barras}
    //                     </span>
    //                 </Row>
    //             ))}
    //         </Modal.Body>
    //     </Modal>
    // )
}