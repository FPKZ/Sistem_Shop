import { Row, Col, Card } from "react-bootstrap"
import TabelaVendas from "@tabelas/TabelaVendas"
import { useNavigate, useOutletContext } from "react-router-dom"
import API from "@app/api"
import { useEffect, useState } from "react"
import { TextAlignCenter } from "lucide-react"

const stily = {
    cursor: "pointer",
    fontSize: "0.9rem",
}

export default function TelaVendas(){
    const { mobile } = useOutletContext()
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
            <Row className="py-2 px-0 m-0 g-2 g-md-4">
                <Col xs={12} sm={4} md={4}>
                    <Card style={stily} onClick={() => navigate("Nova-Venda")}>
                        <Card.Body className="d-flex gap-3 align-items-end">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-plus-fill"></i>
                            </Card.Title>
                            <strong>Nova Venda</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} sm={4} md={4}>
                    <Card style={stily} onClick={() => navigate("Extorno")}>
                        <Card.Body className="d-flex gap-3 align-items-end">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-x-fill"></i>
                            </Card.Title>
                            <strong>Extorno</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={6} sm={4} md={4}>
                    <Card style={stily} onClick={() => navigate("Devolucao")}>
                        <Card.Body className="d-flex gap-3 align-items-end">
                            <Card.Title className="p-0 m-0">
                                <i className="bi bi-bag-dash-fill"></i>
                            </Card.Title>
                            <strong>Devolução</strong>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="py-2 g-2 g-md-4 px-0 m-0">
                <Col md={8} className="">
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