import { Modal, Row, Col, Button, Card, Form, Alert, Container } from "react-bootstrap";
import TabelaVendas from "@tabelas/TabelaVendas"

export default function Vendas(){
    return(
        <Container fluid className="p-2 p-md-4">
             <Row className="border-bottom">
                <h3>Vendas</h3>
             </Row>
             <TabelaVendas/>
        </Container>
    )
}