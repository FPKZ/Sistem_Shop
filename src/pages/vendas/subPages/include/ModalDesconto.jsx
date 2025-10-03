import { Modal, ModalBody, ModalHeader, Form, Row, Col, InputGroup } from "react-bootstrap";

export default function ModalDesconto({onVisible, onHiden}){

    if(!onVisible) return

    return(
        <Modal show={onVisible} onHide={onHiden} animation={true}>
            <ModalHeader className="border-0 pb-0" closeButton>
            </ModalHeader>
            <ModalBody className="pt-1">
                <Form>
                    <Row>
                        <Col>
                            <Form.Label>Selecione o valor do desconto!</Form.Label>
                            <Row>
                                <Col>
                                    <InputGroup>
                                        <Form.Control type="number"/>
                                        <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Text>R$</InputGroup.Text>
                                        <Form.Control type="number"/>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
        </Modal>
    )
}