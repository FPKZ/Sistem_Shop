import { Container, Col, Row, Form, Button, Alert } from "react-bootstrap";
import styles from "../../../../public/css/login.module.css"
import Footer from "./include/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../sistem/AuthContext";


export default function Login() {

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const navigate = useNavigate()

    const { login } = useAuth()

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // RegEx para validar email

        const elements = form.querySelectorAll("[name]")
        
        elements.forEach((e) => {
            const { name, value, required, type } = e

            if(required && !value.trim()){
                newErrors[name] = "Campo obrigatório!"
            }

            if (name === "email" && value && !emailRegex.test(value)) {
                newErrors[name] = "Não é um e-mail válido";
            }
            if (name === "senha" && value && value.length < 6) {
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
            // console.log(data)

            const resposta = await login(data)
            // console.log(resposta)
            
            if(resposta.ok){
                navigate("/");
            } else {
                setErros(resposta || { login: "Email ou senha inválidos" })
                setValidated(true)
            }
            
            // if (data.email === autentc.email && data.senha === autentc.senha){
            //     navigate("/");
            // } else {
            //     // alert("Email ou senha inválidos")
            //     setErros({ login: "Email ou senha inválidos" })
            //     setValidated(true)
            // }
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
            <Row className="justify-content-md-center mt-3">
                <Col md={4} className="text-center">
                    <span>Não tem uma conta? </span>
                    <Button variant="link" onClick={() => navigate("/cadastro-user")}>Cadastre-se</Button>
                </Col>
            </Row>
            <Erros erros={erros} />
            <ContaTeste />
        </Container>
        <Footer />
    </div>
    </>
  );
}

function Erros({ erros }) {
    // console.log(erros)
    return (
        Object.keys(erros).length > 0 && (
            <Row className="justify-content-md-center mt-3">
                <Col md={4} className="text-center">
                    <Alert variant="danger"  role="alert">
                        <ul className="mb-0">
                            {Object.keys(erros).map((key) => {
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

function ContaTeste(){

    const [ teste , setTeste ] = useState(false)

    const autentc = {
        email: "romafe@gmail.com",
        senha: "123456"
    }

    return (
        <Row className="justify-content-md-center mt-3">
            <Col md={4} className="text-center">
                <span className="text-muted">Use a conta de teste para explorar o sistema</span>
                {!teste && (
                    <Button variant="link" onClick={() => setTeste(true)}>Mostrar conta de teste</Button>
                )}
                {teste && (
                    <Row className="justify-content-md-center mt-5">
                        <Col md={4} className="text-center">
                            <span className="text-muted">Teste com:
                                <br />
                                Email:
                                <br />
                                <strong>
                                    {autentc.email}
                                </strong>
                                <br />
                                Senha:
                                <br />
                                <strong>
                                    {autentc.senha}
                                </strong>
                            </span>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    )
}