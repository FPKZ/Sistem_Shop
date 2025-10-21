import { Container, Col, Row, Card, Table, Button, ButtonGroup, Tooltip, OverlayTrigger } from "react-bootstrap"
import { useState, useEffect } from "react"
import API from "@app/api"
import { Check, PenBox, Trash, Trash2 } from "lucide-react"

export default function FerrramentasPage(){
    
    const [ tela, setTela ] = useState()
    const [ solicitacoes, setSolicitacoes ] = useState([])
    const [ users, setUsers ] = useState([])

    useEffect(() => {
        getSolicitaoes()
        getUsers()
    },[])

    const getSolicitaoes = async () => {
        const solicit = await API.getSolicitacoes()
        setSolicitacoes(solicit)
    }

    const getUsers = async () => {
        const u = await API.getUsers()
        setUsers(u)
    }
    console.log(users)
    return (
        <Container className="d-flex flex-column p-2 gap-3">
            <Row>
                <Col>
                    <ButtonGroup className="w-100">
                        <Button onClick={() => setTela("usuarios")}>Usuarios</Button>
                        <Button onClick={() => setTela("solicitacao")}>Solicitação de Cadastro</Button>
                        <Button onClick={() => setTela("usuarios")}>Usuarios</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Visor tela={tela} solicitacoes={solicitacoes} users={users} />
                    {/* <TelaSolicitacao solicitacoes={solicitacoes} /> */}
                </Col>
            </Row>
        </Container>
    )
}

function Visor({tela, solicitacoes, users}){
    switch(tela){
        case "solicitacao":
            return <TelaSolicitacao solicitacoes={solicitacoes} />
        default:
            return <TelaUsers users={users} />
    }
}

function TelaSolicitacao({solicitacoes}){
    // console.log(solicitacoes)

    const deleteSolicitacao = async (e) => {
        console.log(e)
        const response = API.deleteSolicitacao(e.id)
        console.log(response)
        
    }

    return(
        <Card>
            <Card.Header>
                <Card.Title>Solicitações de cadastro</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
                <Row className="text-center bg-body-tertiary m-0 p-2 border-bottom">
                    <Col><strong>Nome</strong></Col>
                    <Col><strong>Email</strong></Col>
                    <Col><strong>Ação</strong></Col>
                </Row>
                <Row className="p-0 m-0">
                    {
                        solicitacoes?.map((solict) => (
                            <Row key={solict.id} className="text-center m-0 p-2 border-bottom">
                                <Col className="d-flex gap-2 justify-content-center text-capitalize"><strong className="d-flex justify-content-center align-items-center">{solict.nome}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center "><strong className="d-flex justify-content-center align-items-center">{solict.email}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center">
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Aceitar Cadastro</Tooltip>
                                    }>
                                        <Button variant="success" size="sm">
                                            <Check size={"15"} />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Recusar Cadastro</Tooltip>
                                    }>
                                        <Button variant="danger" size="sm" onClick={() => deleteSolicitacao(solict)}>
                                            <Trash2 size={"15"} />
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        ))
                    }
                </Row>
            </Card.Body>
        </Card>
    )
}

function TelaUsers({users}){


    const deleteUser = async (e) => {
        console.log(e)
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Solicitações de cadastro</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
                <Row className="text-center bg-body-tertiary m-0 p-2 border-bottom">
                    <Col><strong>Nome</strong></Col>
                    <Col><strong>Cargo</strong></Col>
                    <Col><strong>Ação</strong></Col>
                </Row>
                <Row className="p-0 m-0">
                    {
                        users?.map((user) => (
                            <Row key={user.id} className="text-center m-0 p-2 border-bottom">
                                <Col className="d-flex gap-2 justify-content-center text-capitalize"><strong className="d-flex justify-content-center align-items-center">{user.nome}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center "><strong className="d-flex justify-content-center align-items-center">{user.cargo}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center">
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Editar Cargo</Tooltip>
                                    }>
                                        <Button variant="secondary" size="sm" >
                                            <PenBox size={"15"} />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Excluir Usuario</Tooltip>
                                    }>
                                        <Button variant="danger" size="sm" onClick={() => deleteUser(user)}>
                                            <Trash2 size={"15"} />
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        ))
                    }
                </Row>
            </Card.Body>
        </Card>
    )
}