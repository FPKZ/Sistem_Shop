import { Modal, Card, Row } from "react-bootstrap"
import "./ProdutosCriados.css"

export default function ProdutosCriados({visible, onClose, itens}){

    if(!visible) return
    return (
        <Modal show={visible} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Produtos cadastrados / IDs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                {itens.map(iten => (
                    <Row className="d-flex justify-content-center align-items-center p-3">
                        <Card key={iten.id} className="console-id">
                                <strong>{iten.id || 1}</strong>
                        </Card>
                    </Row>
                ))}
            </Modal.Body>
        </Modal>
    )
}