import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap"
import styles from "../../../../public/css/cadastro.module.css"
import Footer from "../include/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../sistem/AuthContext";

import React, { useEffect } from 'react';

export default function CadastroUser() {

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const navigate = useNavigate()

    const { login } = useAuth()

    // ... dentro do componente CadastroUser
    useEffect(() => {
        // Adiciona a classe ao body quando o componente monta
        document.body.classList.add('body-scroll-visible');

        // Remove a classe do body quando o componente desmonta
        return () => {
            document.body.classList.remove('body-scroll-visible');
        };
    }, []); // O array vazio garante que o efeito rode apenas uma vez

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
                newErrors[name] = `Campo ${name} obrigatório!`
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
        <div className={styles.cadastro}>
            <Container className="mb-5">
                <Row className="justify-content-center mt-5">
                    <Col sm={12} md={8} lg={8} className="text-center">
                        <h1>Bem-vindo ao Cadastro de Usuário</h1>
                        <p/>
                        <p>Por favor, preencha o formulário abaixo para criar sua conta.</p>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col sm={8} md={6} lg={4}>
                        <Form onSubmit={handleSubmit} noValidate>
                            <Col className="mb-3">
                                <Form.Label htmlFor="name" className="form-label">Nome Completo</Form.Label>
                                <Form.Control type="text" className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : "" }`} name="nome" value={formValue.nome || ""} onChange={handleChange} required id="name" placeholder="Digite seu nome completo" />
                            </Col>
                            <Col className="mb-3">
                                <Form.Label htmlFor="email" className="form-label">Email</Form.Label>
                                <Form.Control type="email" className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : "" }`} name="email" value={formValue.email || ""} onChange={handleChange} required placeholder="Digite seu email" />
                            </Col>
                            <Col className="mb-3">
                                <Form.Label htmlFor="password" className="form-label">Senha</Form.Label>
                                <Form.Control type="password" className={`form-control ${validated ? (erros.senha ? `is-invalid` : `is-valid`) : "" }`} name="senha" value={formValue.senha || ""} onChange={handleChange} required placeholder="Digite sua senha" />
                            </Col>
                            <Col className="mb-3">
                                <Form.Label htmlFor="confirmPassword" className="form-label">Confirme a Senha</Form.Label>
                                <Form.Control type="password" className={`form-control ${validated ? (erros.confirmSenha ? `is-invalid` : `is-valid`) : "" }`} name="confirmSenha" value={formValue.confirmSenha || ""} onChange={handleChange} required id="confirmPassword" placeholder="Confirme sua senha" />
                            </Col>
                            <Button type="submit" className="btn btn-roxo w-100">Cadastrar</Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col sm={12} md={8} lg={8} className="text-center">
                        <p>Ao clicar em "Cadastrar", você concorda com nossos <a href="">Termos de Serviço</a> e <a href="">Política de Privacidade</a>.</p>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3 mb-5">
                    <Col sm={12} md={8} lg={8} className="text-center">
                        <p>Já tem uma conta? <Button variant="link" onClick={() => navigate("/login")} >Faça login aqui.</Button>.</p>
                    </Col>
                </Row>
                <Erros erros={erros} />
            </Container>
            <Footer />
        </div>
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