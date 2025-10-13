import { Container, Col, Row, Form, Button } from "react-bootstrap";
import styles from "../../../public/css/login.module.css"
import Footer from "./include/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const autentc = {
    email: "romafe@gmail.com",
    senha: "123456"
}

export default function Login() {

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const navigate = useNavigate()

    function handleChange(e){
        const { name, value, type } = e.target
        let newValue = value

        if (name === "email") {
            newValue = value.trim();
          }

        setFormValue({
            ...formValue,
            [name]: newValue,
        })
    }

    
    function validate(form){
        let newErrors = {};
        
        const elements = form.querySelectorAll("[name]")
        
        elements.forEach((e) => {
            const { name, value, required, type } = e

            if(required && !value.trim()){
                newErrors[name] = "Campo obrigatório!"
            }

            if (name === "email" && value && !value.includes("@") && !value.includes(".")) {
                newErrors[name] = "E-mail inválido";
            }
            if (name === "password" && value && value.length < 6) {
                newErrors[name] = "A senha deve ter pelo menos 6 caracteres";
            }
        })
        return newErrors
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica de autenticação
        const form = e.target;

        const newErrors = validate(form)
        setErros(newErrors)
        setValidated(true)
        //console.log(erros)
        //console.log(validated)

        if(Object.keys(newErrors).length === 0){
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())
            console.log(data)
            if (data.email === autentc.email && data.senha === autentc.senha){
                navigate("/");
            } else {
                alert("Email ou senha inválidos")
            }
            // const responsta = await API.postClientes(data)
            // if(responsta.ok) navigate(-1)
        }
        //navigate("/");
    }

  return (
    <>
    <div className={styles.loginContainer}>
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={4}>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : "" }`} name="email" value={formValue.email || ""} onChange={handleChange} placeholder="Enter email" required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className={`form-control ${validated ? (erros.senha ? `is-invalid` : `is-valid`) : "" }`} name="senha" value={formValue.senha || ""} onChange={handleChange} placeholder="Password" required />
                        </Form.Group>
                        <Button type="submit" className="btn-roxo w-100">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        <Footer />
    </div>
    </>
  );
}