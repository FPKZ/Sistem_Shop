import { Modal, Button } from "react-bootstrap";

export default function Confirm({show, handleClose, handleConfirm, title, message}) {
    
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size="sm"
        >
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="text-center w-100">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer className="border-0 flex justify-content-center">
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="none" className="btn-roxo" onClick={handleConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
