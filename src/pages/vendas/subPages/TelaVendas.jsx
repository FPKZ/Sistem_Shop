import { Row, Col, Card } from "react-bootstrap"
import TabelaVendas from "@tabelas/TabelaVendas"
import { useNavigate } from "react-router-dom"
import API from "@app/api"
import { useEffect, useState } from "react"

export default function TelaVendas(){
    const navigate = useNavigate()

    const [ vendas, setVendas ] = useState([])

    useEffect(() => {
        getVendas()
    },[])
    
    const getVendas = async () => {
        const v = await API.getVendas()
        setVendas(v)
    }
    
    console.log(vendas)
    return (
        <>
            <Row className="py-2">
                <Col>
                    <Card style={{cursor: "pointer"}} onClick={() => navigate("NovaVenda")}>
                        <Card.Body className="d-flex gap-3">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-plus-fill"></i>
                            </Card.Title>
                            <strong>Nova Venda</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{cursor: "pointer"}} onClick={() => navigate("Extorno")}>
                        <Card.Body className="d-flex gap-3">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-x-fill"></i>
                            </Card.Title>
                            <strong>Extorno</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{cursor: "pointer"}} onClick={() => navigate("Devolucao")}>
                        <Card.Body className="d-flex gap-3">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-dash-fill"></i>
                            </Card.Title>
                            <strong>Devolução</strong>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="py-2">
                <Col md={8}>
                    <TabelaVendas vendas={vendas}/>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <strong>Graficos de Vendas</strong>
                        </Card.Body>
                    </Card>                
                </Col>
            </Row>
        </>
    )
}