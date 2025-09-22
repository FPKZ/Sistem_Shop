import { Modal, Row, Col, Button, Card, Form, Alert, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";


export default function Vendas(){
    
    return(
        <Container fluid className="p-2 p-md-4">
            <Outlet/>
        </Container>
    )
}