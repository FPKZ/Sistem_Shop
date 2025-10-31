import { Container, Col, Row, Card, Table, Button, ButtonGroup, Tooltip, OverlayTrigger, Modal } from "react-bootstrap"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "@app/api"
import { Check, PenBox, Trash2 } from "lucide-react"
import Footer from "@components/layout/components/Footer"
import "../../../../public/css/components/footer.css"
import "../../../../public/css/sistem/ferramentas.css"

export default function FerrramentasPage(){
    
    const [ tela, setTela ] = useState("usuarios")
    const [ solicitacoes, setSolicitacoes ] = useState([])
    const [ users, setUsers ] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getSolicitacoes()
        getUsers()
    },[tela])

    const getSolicitacoes = async () => {
        const solicit = await API.getSolicitacoes()
        setSolicitacoes(solicit)
    }

    const getUsers = async () => {
        const u = await API.getUsers()
        setUsers(u)
    }


    
    function TelaSolicitacao({solicitacoes}){
        // console.log(solicitacoes)

        const deleteSolicitacao = async (solict) => {
            const response = await API.deleteSolicitacao(solict.id)
            console.log(response)
            await getSolicitacoes()
        }
        
        const aproveSolicitacao = async (solict) => {
            await API.aproveSolicitacoes(solict.id)
            await getSolicitacoes()
        }
    
        return(
            <Row className="p=0 m-0 border rounded-2 overflow-hidden">
                <Row className="text-center bg-body-tertiary m-0 p-2">
                    <Col><strong>Nome</strong></Col>
                    <Col><strong>Email</strong></Col>
                    <Col><strong>Ação</strong></Col>
                </Row>
                <Row className="p-0 m-0">
                    {
                        solicitacoes?.map((solict) => (
                            <Row key={solict.id} className="text-center m-0 p-2 border-top">
                                <Col className="d-flex gap-2 justify-content-center text-capitalize"><strong className="d-flex justify-content-center align-items-center">{solict.nome}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center "><strong className="d-flex justify-content-center align-items-center">{solict.email}</strong></Col>
                                <Col className="d-flex gap-2 justify-content-center">
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>Aceitar Cadastro</Tooltip>
                                    }>
                                        <Button variant="success" size="sm" onClick={() => aproveSolicitacao(solict)}>
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
            </Row>
        )
    }

    function TelaUsers({users}){

        const [ userDelet, setUserDelet ] = useState({})
        const [ modal, setModal ] = useState(false)


        const deleteUser = async (user) => {
            await API.deleteUser(user.id)
            await getUsers()
        }


        const handleDeleteClick = async (user) => {
            setUserDelet(user)
            setModal(true)
        }

        return (
            <Row className="p-0 m-0 border rounded-2 overflow-hidden">
                <Row className="text-center bg-body-tertiary m-0 p-2 ">
                    <Col><strong>Nome</strong></Col>
                    <Col><strong>Cargo</strong></Col>
                    <Col><strong>Ação</strong></Col>
                </Row>
                <Row className="p-0 m-0">
                    {
                        users?.map((user) => (
                            <Row key={user.id} className="text-center m-0 p-2 border-top">
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
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(user)}>
                                            <Trash2 size={"15"} />
                                        </Button>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        ))
                    }
                </Row>
                <Modal show={modal} onHide={() => setModal(false)} size="sm" centered backdrop={false}>
                    <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
                            <Row>
                                <Modal.Title>Deseja excluir o usuario</Modal.Title>
                            </Row>
                            <Row><Modal.Title>{userDelet.nome}</Modal.Title></Row>
                            <Row className="mt-3">
                                <Col className="d-flex gap-2">
                                    <Button variant="success" onClick={() => {deleteUser(userDelet); setModal(false)}}>Excluir</Button>
                                    <Button variant="danger" onClick={() => setModal(false)}>Cancelar</Button>
                                </Col>
                            </Row>
                    </Modal.Body>
                </Modal>
            </Row>
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

    return (<>
        <div className="h-100">
            <Row className="p-4">
                <Col className="py-3 mb-4 d-flex align-items-center">
                    <Button className="btn btn-roxo h-75" onClick={() => navigate(-1)}><i className="bi bi-chevron-left"></i></Button>
                    <h1 className="ms-3">Ferramentas de Adiministrador</h1>
                </Col>
            </Row>
            <Row className="h-75 p-4">
                <Col md={2} className="p-2 py-0 border-end">
                    <ButtonGroup vertical className="w-100 gap-3">
                        <Button variant="" className="text-start" onClick={() => setTela("usuarios")}>Usuarios</Button>
                        <Button variant="" className="text-start" onClick={() => setTela("solicitacao")}>Solicitação de Cadastro</Button>
                        <Button variant="" className="text-start" onClick={() => setTela("usuarios")}>Usuarios</Button>
                    </ButtonGroup>
                </Col>
                <Col md={10} className="p-2 px-3">
                    <Visor tela={tela} solicitacoes={solicitacoes} users={users} />
                </Col>
            </Row>
        </div>
        <Footer />
        {/* <Container className="d-flex flex-column p-2 gap-3">
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
                </Col>
            </Row>
        </Container> */}
    </>
    )
}

