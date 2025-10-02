import TabelaProduto from "@components/modal/Tabelas/TabelaProduto"
import { Row, Col, Card, Button, Form, Accordion, ButtonGroup, AccordionButton, useAccordionButton, Tooltip, OverlayTrigger } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import util from "@app/utils"
import API from "@app/api"


const exemple = {
    id: 8,
    nome: "algema",
    img: "teste",
    descricao: "wsadaSDASD",
    createdAt: "2025-09-15T22:04:54.955Z",
    updatedAt: "2025-09-15T22:04:54.955Z",
    categoria_id: 3,
    categoria: {
        id: 3,
        nome: "Acessorios",
        descricao: "asdasad",
        createdAt: "2025-09-15T14:32:55.040Z",
        updatedAt: "2025-09-15T14:32:55.040Z"
    },
    itemEstoque: [
        {
            id: 9,
            nome: "algemaaaaaa",
            tamanho: "21",
            cor: "#a3a3a3",
            marca: "gal",
            codigo_barras: "1231243124124124124124",
            valor_compra: 123,
            valor_venda: 12,
            lucro: 12,
            status: "Disponivel",
            createdAt: "2025-09-15T22:04:55.025Z",
            updatedAt: "2025-09-15T22:04:55.025Z",
            produto_id: 8,
            nota_id: 1,
            nota: {
                id: 1,
                codigo: "52346",
                quantidade: 15,
                valor_total: 150.5,
                data: "2025-09-11T23:39:19.585Z",
                createdAt: "2025-09-15T13:31:23.756Z",
                updatedAt: "2025-09-15T13:31:23.756Z"
            }
        },
        {
            id: 10,
            nome: "algema",
            tamanho: "21",
            cor: "#a3a3a3",
            marca: "gal",
            codigo_barras: "1231243124124124124124",
            valor_compra: 123,
            valor_venda: 12,
            lucro: 12,
            status: "Disponivel",
            createdAt: "2025-09-15T22:05:10.892Z",
            updatedAt: "2025-09-15T22:05:10.892Z",
            produto_id: 8,
            nota_id: 1,
            nota: {
                id: 1,
                codigo: "52346",
                quantidade: 15,
                valor_total: 150.5,
                data: "2025-09-11T23:39:19.585Z",
                createdAt: "2025-09-15T13:31:23.756Z",
                updatedAt: "2025-09-15T13:31:23.756Z"
            }
        }
    ]
}

export default function NovaVenda(){
    const [clientes, setClientes] = useState([])
    const [cliente, setCliente] = useState({})
    
    const navigate = new useNavigate()

    useEffect(() => {
        getClientes()
        // clienteSet()
    },[])


    const getClientes = async () => {
        const c = await API.getClientes()
        setClientes(c)
        setCliente(c[0])
    }
    const clienteSet = async () => {
        // const c = clientes[0]
        // console.log(c)
        // setCliente(c)
    }
    
    function AbrirToggle({children, eventKey = "0", ...rest}) {
        const click = useAccordionButton(eventKey)
        
        return (
            <Button {...rest} onClick={click}>
                {children}
            </Button>
        )
    }

    console.log(clientes)
    console.log(cliente)
    
    return(
        <>
            <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
                <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left"></i>
                </Button>
                <h1 className="h3 m-0">Nova Venda</h1>
            </div>
            <Row className="g-3">
                <Col xs={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between px-2">
                            <Card.Title className="m-0 align-content-center">
                                Cliente
                            </Card.Title>
                            <div className="d-flex gap-2">
                                <Button className="btn-roxo">Adicionar</Button>
                                <Button className="btn-roxo">Editar</Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Accordion flush >
                                <Card border="0">
                                    <Card.Header className="d-flex justify-content-between bg-transparent">
                                        <div>
                                            {cliente.nome}
                                        </div>
                                        <ButtonGroup size="sm">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-top">Visualizar</Tooltip>
                                                }
                                            >
                                                <AbrirToggle  variant="outline-secondary"><i className="bi bi-eye"></i></AbrirToggle>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-top">
                                                        Alterar Cliente
                                                    </Tooltip>
                                                }
                                            >
                                                <Button  variant="outline-warning"><i className="bi bi-pencil"></i></Button>
                                            </OverlayTrigger>
                                        </ButtonGroup>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0" className="p-3">
                                        <Row>
                                            <Col md={8}>
                                                <Form.Group>
                                                    <Form.Label>Nome</Form.Label>
                                                    <Form.Control type="text" value={cliente.nome} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label>Telefone</Form.Label>
                                                    <Form.Control type="text" value={cliente.telefone} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col md={5}>
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control type="text" value={cliente.email} disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Endereço</Form.Label>
                                                    <Form.Control type="text" value={cliente.endereco} disabled />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                <Card>
                    <Card.Header className="d-flex justify-content-between p-2 align-items-center">
                        <Card.Title className="m-0">Itens Vendidos ({exemple.itemEstoque.length || 0})</Card.Title>
                        <Button className="btn-roxo"><i className="bi bi-plus-lg me-2"></i> Adicionar Item</Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <TabelaProduto produto={exemple} />
                    </Card.Body>
                </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header className="bg-light bg-opacity-25 p-3">
                            <Card.Title className="m-0">Detalhes da Venda</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Text>Forma de Pagamento: </Card.Text>
                                <Card.Text>{"Dinheiro"}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text>Valor dos Produtos:</Card.Text>
                                <Card.Text>{util.formatMoney()}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="mb-0">Desconto:</Card.Text>
                                <Card.Text className="mb-0">{util.formatMoney()}</Card.Text>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-light bg-opacity-25 p-3">
                            <div className="d-flex justify-content-between">
                                <Card.Text className="mb-0">Valor Total:</Card.Text>
                                <Card.Text className="mb-0">{util.formatMoney()}</Card.Text>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Button size="lg" className="btn-roxo w-100 my-3">Finalizar Compra</Button>
                </Col>
            </Row>
        </>
    )
}