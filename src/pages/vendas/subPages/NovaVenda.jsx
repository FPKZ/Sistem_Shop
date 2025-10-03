import TabelaProduto from "./include/TabellaVendaProduto"
import ModalDesconto from "./include/ModalDesconto"
import ProdutosInfo from "@components/modal/InfoProdutos/InfoProdutos";
import { Row, Col, Card, Button, Form, Accordion, ButtonGroup, AccordionButton, useAccordionButton, Tooltip, OverlayTrigger } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import util from "@app/utils"
import API from "@app/api"

export default function NovaVenda(){
    const [clientes, setClientes] = useState([])
    const [cliente, setCliente] = useState({})
    const [produtos, setProdutos] = useState([])
    const [produto, setProduto] = useState({})
    const [listaVenda, setListaVenda] = useState([])

    const [modalDesconto, setModalDesconto] = useState(false)
    const [modalInfoProduto, setmodalInfoProduto] = useState(false)
    
    const navigate = new useNavigate()

    useEffect(() => {
        getClientes()
        getProdutos()
        // clienteSet()
    },[])


    const getClientes = async () => {
        const c = await API.getClientes()
        setClientes(c)
        //setCliente(c[0])
    }
    const getProdutos = async () => {
        const p = await API.getProduto({item: "estoque"})
        // console.log(p)
        setProdutos(p)
    }
    const addLista = async (data) => {
        // const novaList = listaVenda.concat(data)
        setListaVenda(listaVenda => [...listaVenda, data])
    }
    const deleteList = async (id) => {
        const novaList = listaVenda.filter(item => item.id !== id)
        setListaVenda(novaList)
    }
    const test = async () => {
        // console.log("exec")
        for(let i = 0; i < 5; i++){
            await addLista(produtos[i])
        }
    }
    const clienteSet = async () => {
        // const c = clientes[0]
        // console.log(c)
        // setCliente(c)
    }

    function SomaProdutos({listaVenda}){
        if(!listaVenda) return
        const valorTotal = listaVenda.reduce((soma, item) => {
            return soma + item.valor_venda
        }, 0)

        return (
            <>
            {util.formatMoney(valorTotal)}
            </>
        )
    }
    
    function AbrirToggle({children, eventKey = "0", ...rest}) {
        const click = useAccordionButton(eventKey)
        
        return (
            <Button {...rest} onClick={click}>
                {children}
            </Button>
        )
    }

    // console.log(clientes)
    console.log(produto)
    // console.log(listaVenda)
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
                                <Button className="btn-roxo" onClick={() => setCliente(clientes[0])}>{!cliente.id ? "Adicnionar" : "Alterar"}</Button>
                            </div>
                        </Card.Header>
                        {cliente.id && (

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
                        )}
                    </Card>
                </Col>
                <Col md={8}>
                <Card>
                    <Card.Header className="d-flex justify-content-between p-2 align-items-center">
                        <Card.Title className="m-0">Itens Vendidos ({listaVenda.length || 0})</Card.Title>
                        <Button className="btn-roxo" onClick={test}><i className="bi bi-plus-lg me-2"></i> Adicionar Item</Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <TabelaProduto produto={listaVenda} setmodalInfoProduto={setmodalInfoProduto} setProduto={setProduto} deleteList={deleteList}/>
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
                                <Card.Text>
                                    <SomaProdutos listaVenda={listaVenda}/>
                                </Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="mb-0">Desconto:</Card.Text>
                                <Card.Text className="mb-0">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id="tooltip-top">Editar Desconto</Tooltip>
                                        }
                                    >
                                        <a className="me-2 text-body-secondary" onClick={() => setModalDesconto(true)} style={{cursor: "pointer"}}>
                                            <i className="bi bi-pencil-square"></i>
                                        </a>
                                    </OverlayTrigger>
                                    
                                    {util.formatMoney()}
                                </Card.Text>
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
            <ModalDesconto onVisible={modalDesconto} onHiden={() => setModalDesconto(false)}/>
            <ProdutosInfo visible={modalInfoProduto} onClose={() => setmodalInfoProduto(false)} produto={produto} tableShow={false}/>
        </>
    )
}