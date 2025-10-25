import { Button, Form, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import API from "@app/api";
import Erros from "@components/Erros";


export default function CadastroCategoria({ visible, onClose }){

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    function handleChange(e){
        const { name, value } = e.target
        if(name === 'categoria') console.log('1')
        setFormValue({
            ...formValue,
            [name]: value,
        })
    }

    function validate(form){
        let newErrors = {};
        
        const elements = form.querySelectorAll("[name]")
        
        elements.forEach((e) => {
            const { name, value, required, type } = e

            if(required && !value.trim()){
                newErrors[name] = `Campo ${name} obrigatório!`
            }
            
            if (type == "number" && value && isNaN(value)){
                newErrors[name] = "Digite um valor numerico valido"
            }
        })
        return newErrors
    }
    
    const handleSubimit = async (e) => {
        e.preventDefault()
        const form = e.target;

        const newErrors = validate(form)
        setErros(newErrors)
        setValidated(true)
        if(Object.keys(newErrors).length === 0){
            const data = new FormData(e.target)
            const data_refatorada = Object.fromEntries(data.entries())
            console.log(data_refatorada)
            const resp = await API.postCategoria(data_refatorada)
            const response = await (resp).json()
            console.log(response)
            if (!response.ok){
                setErros({error: response.message, nome: "skip", descricao: "skip"})
            }
            if(response.ok){
                onClose()
            }
        }
    }
    
    return(
        <Modal show={visible} onHide={onClose}>
            <Form onSubmit={handleSubimit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar nova categoria!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className=" gap-3">
                        <Form.Group>
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control type="text" className={`form-control ${validated ? (erros.nome ? "is-invalid" : "is-valid") : ""}`} name="nome" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descrição:</Form.Label>
                            <Form.Control type="text" className={`form-control ${validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""}`} name="descricao" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Button className="btn btn-roxo w-100" type="submit">Cadastrar</Button>
                        </Form.Group>
                    </Row>
                </Modal.Body>
            </Form>
            <Erros erros={erros} />
        </Modal>
    )
}