import { Row, Col, Alert } from "react-bootstrap"

export default function Erros({ erros }) {
    // console.log(erros)
    return (
        Object.keys(erros).length > 0 && (
            <Row className="justify-content-md-center mt-3">
                <Col md={6} className="text-center">
                    <Alert variant="danger"  role="alert">
                        <ul className="mb-0">
                            {Object.keys(erros).map((key) => {
                                if(erros[key] === "skip"){
                                    return null
                                }
                                if(!erros[key]){
                                    return null
                                }else{
                                    return (
                                        <li key={key}>{erros[key]}</li>
                                    )
                                }
                            })}
                        </ul>
                    </Alert>
                </Col>
            </Row>
        )
    )
}