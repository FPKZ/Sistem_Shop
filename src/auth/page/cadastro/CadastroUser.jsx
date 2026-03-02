import { Container, Row, Col, Form, Button } from "react-bootstrap";
import styles from "../../../../public/css/cadastro.module.css";
import Footer from "../include/Footer";
import { useNavigate } from "react-router-dom";
import { useCadastroUser } from "@hooks/auth/useCadastroUser";
import Erros from "@components/Erros";
import React, { useEffect } from "react";

export default function CadastroUser() {
  const navigate = useNavigate();
  const { formValue, erros, validated, handleChange, handleSubmit } =
    useCadastroUser();

  useEffect(() => {
    document.body.classList.add("body-scroll-visible");
    return () => {
      document.body.classList.remove("body-scroll-visible");
    };
  }, []);

  return (
    <div className={styles.cadastro}>
      <Container className="mb-5">
        <Row className="justify-content-center mt-5">
          <Col sm={12} md={8} lg={8} className="text-center">
            <h1>Bem-vindo ao Cadastro de Usuário</h1>
            <p />
            <p>Por favor, preencha o formulário abaixo para criar sua conta.</p>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col sm={8} md={6} lg={4}>
            <Form onSubmit={handleSubmit} noValidate>
              <Col className="mb-3">
                <Form.Label htmlFor="name" className="form-label">
                  Nome Completo
                </Form.Label>
                <Form.Control
                  type="text"
                  className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : ""}`}
                  name="nome"
                  value={formValue.nome || ""}
                  onChange={handleChange}
                  required
                  id="name"
                  placeholder="Digite seu nome completo"
                />
              </Col>
              <Col className="mb-3">
                <Form.Label htmlFor="email" className="form-label">
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : ""}`}
                  name="email"
                  value={formValue.email || ""}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu email"
                />
              </Col>
              <Col className="mb-3">
                <Form.Label htmlFor="password" className="form-label">
                  Senha
                </Form.Label>
                <Form.Control
                  type="password"
                  className={`form-control ${validated ? (erros.senha ? `is-invalid` : `is-valid`) : ""}`}
                  name="senha"
                  value={formValue.senha || ""}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua senha"
                />
              </Col>
              <Col className="mb-3">
                <Form.Label htmlFor="confirmPassword" className="form-label">
                  Confirme a Senha
                </Form.Label>
                <Form.Control
                  type="password"
                  className={`form-control ${validated ? (erros.confirmSenha ? `is-invalid` : `is-valid`) : ""}`}
                  name="confirmSenha"
                  value={formValue.confirmSenha || ""}
                  onChange={handleChange}
                  required
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                />
              </Col>
              <Button type="submit" className="btn btn-roxo w-100">
                Cadastrar
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col sm={12} md={8} lg={8} className="text-center">
            <p>
              Ao clicar em "Cadastrar", você concorda com nossos{" "}
              <a href="">Termos de Serviço</a> e{" "}
              <a href="">Política de Privacidade</a>.
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3 mb-5">
          <Col sm={12} md={8} lg={8} className="text-center">
            <p>
              Já tem uma conta?{" "}
              <Button variant="link" onClick={() => navigate("/login")}>
                Faça login aqui.
              </Button>
              .
            </p>
          </Col>
        </Row>
        <Erros erros={erros} />
      </Container>
      <Footer />
    </div>
  );
}
