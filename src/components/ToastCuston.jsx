import { Toast, ToastContainer } from "react-bootstrap";


export default function ToastCuston({visible, onClose, children}){

    return(
        <ToastContainer position="bottom-end" style={{ zIndex: 2000, marginRight: "1.5rem", maxWidth: "35%" }}>
            <Toast show={visible} onClose={onClose} delay={3000} autohide bg="danger">
                <Toast.Body className="text-white fs-4">
                    <strong>
                        {children || "Erro na aplicação"}
                    </strong>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}