import { Modal, Row, Col, Button, Card, Form, Alert, Container } from "react-bootstrap";
import { Outlet, useOutletContext, useLocation, useNavigate } from "react-router-dom";

import utils from "@app/utils";


export default function Vendas(){
    const { mobile } = useOutletContext()

    const navigate = new useNavigate()

    const location = useLocation()
    const pathParts = location.pathname.split('/').filter(part => part)
    
    return(
        <Container fluid className="p-2 p-md-4">
            <div className="d-flex justify-content-center flex-wrap flex-md-nowarp align-items-start pb-3 mb-3 gap-2 border-bottom position-relative">
                <Button className="btn btn-roxo position-absolute start-0" onClick={() => {pathParts.length > 1 ? navigate(-1) : navigate('/')}}>
                    <i className="bi bi-chevron-left"></i>
                </Button>
                <nav
                    className="d-flex justify-content-center align-items-center m-0"
                    aria-label="breadcrumb"
                >
                    <ol className="breadcrumb breadcrumb-sm-chevron d-flex align-content-center m-0">
                    {pathParts.length &&
                        pathParts.map(tela => (
                        <h1 className="h3 breadcrumb-item m-0 d-flex align-items-center">{utils.capitalize(tela).replace('-', " ")}</h1>
                        ))}
                    </ol>
                </nav>
            </div>
            <Outlet context={{ mobile }}/>
        </Container>
    )
}