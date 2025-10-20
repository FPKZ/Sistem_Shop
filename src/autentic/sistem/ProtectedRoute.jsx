import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

import { Container, Row, Col} from "react-bootstrap";

export default function ProtectedRoute() {
    const { isAutenticated, loading, verificLogin, initServer } = useAuth();
    const location = useLocation()

    useEffect(() => {
        verificLogin()
    },[location])

    console.log(loading)

    if (loading) {
        return (
            <Container>
                <Row className="justify-content-md-center mt-5">
                    <Col md={4} className="text-center">
                        <h2>Verificando autenticação...</h2>
                    </Col>
                </Row>
            </Container>
        );
    } else {
        return isAutenticated() ? <Outlet /> : <Navigate to="/login" />;
    }
}