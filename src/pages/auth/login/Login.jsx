import { Container, Col, Row, Form, Button } from "react-bootstrap";
import styles from "../../../../public/css/login.module.css";
import Footer from "../include/Footer";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@hooks/auth/useLogin";
import Erros from "@components/Erros";
import React, { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { formValue, erros, validated, handleChange, handleSubmit } =
    useLogin();

  useEffect(() => {
    document.body.classList.add("body-scroll-visible");
    return () => {
      document.body.classList.remove("body-scroll-visible");
    };
  }, []);

  return (
    <>
      <div className={styles.loginContainer}>
        <Container className="mb-5">
          <Row className="justify-content-center mt-5">
            <Col sm={6} md={6} lg={4}>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : ""}`}
                    name="email"
                    value={formValue.email || ""}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    className={`form-control ${validated ? (erros.senha ? `is-invalid` : `is-valid`) : ""}`}
                    name="senha"
                    value={formValue.senha || ""}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </Form.Group>
                <Button type="submit" className="btn-roxo w-100">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center mt-3">
            <Col sm={6} md={6} lg={4} className="text-center">
              <span>Não tem uma conta? </span>
              <Button variant="link" onClick={() => navigate("/cadastro-user")}>
                Cadastre-se
              </Button>
            </Col>
          </Row>
          <Erros erros={erros} />
        </Container>
        <Footer />
      </div>
    </>
  );
}
