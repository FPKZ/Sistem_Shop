import { Container, Col, Row, Card, Table, Tabs, Tab, Button, ButtonGroup, Tooltip, OverlayTrigger, Modal, Badge, InputGroup, Form, Image, Pagination } from "react-bootstrap"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "@app/api"
import utils from "@app/utils"
import { Bell, Check, CheckCircle, Edit, PenBox, Search, Trash2, User, UserPlus, XCircle } from "lucide-react"
import "../../../../public/css/components/footer.css"
import "../../../../public/css/sistem/ferramentas.css"

export default function FerrramentasPage(){
    
    const [ tela, setTela ] = useState("usuarios")
    const [ solicitacoes, setSolicitacoes ] = useState([])
    const [ users, setUsers ] = useState([])
    
    const [ userDelet, setUserDelet ] = useState({})
    const [ modal, setModal ] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getSolicitacoes()
        getUsers()
    },[tela])

    const getSolicitacoes = async () => {
        const solicit = await API.getSolicitacoes()
        console.log(solicit)
        setSolicitacoes(solicit)
    }

    const getUsers = async () => {
        const u = await API.getUsers()
        console.log(u)
        setUsers(u)
    }


    const deleteSolicitacao = async (solict) => {
        const response = await API.deleteSolicitacao(solict.id)
        console.log(response)
        await getSolicitacoes()
    }
    
    const aproveSolicitacao = async (solict) => {
        await API.aproveSolicitacoes(solict.id)
        await getSolicitacoes()
    }



    const deleteUser = async (user) => {
        await API.deleteUser(user.id)
        await getUsers()
    }


    const handleDeleteClick = async (user) => {
        setUserDelet(user)
        setModal(true)
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

        <main className="flex-grow-1 overflow-auto p-4 p-sm-6 p-md-8" >
            <Container fluid="xl">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
                    <h2 className="h3 fw-bold mb-3 mb-sm-0" >Gerenciamento de Usuário</h2>
                    {/* <Button variant="primary" className="d-flex align-items-center position-relative">
                        <Bell size={16} className="me-2" />
                        Solicitaçoes Pendentes
                        <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" >
                            {solicitacoes.length}
                        </Badge>
                    </Button> */}
                </div>

                <Tabs defaultActiveKey="users" id="user-management-tabs" className="mb-3">
                    <Tab eventKey="users" title={<><User size={16} className="me-3" /> Todos os Usuários</>}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                                    <InputGroup className="mb-3 mb-sm-0" style={{ maxWidth: "250px"}}>
                                        <InputGroup.Text><Search size={16} /></InputGroup.Text>
                                        <Form.Control placeholder="Buscar usuário..." />
                                    </InputGroup>
                                    <Button variant="primary" className="d-flex align-items-center">
                                        <UserPlus size={16} className="me-2" />
                                        Adicionar Usuário
                                    </Button>
                                </div>
                                <Table responsive hover>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Permissões</th>
                                            <th>Data de Criação</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Image src={user.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} roundedCircle width="40" height="40" className="me-3" />
                                                        <div>
                                                            <div className="fw-bold">{user.nome}</div>
                                                            <div className="text-muted small">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.cargo}</td>
                                                <td>{utils.formatDateTime(user.createdAt)}</td>
                                                <td>
                                                    <Button variant="link" size="sm" className="text-secondary"><Edit size={16} /></Button>
                                                    <Button variant="link" size="sm" className="text-danger" onClick={() => handleDeleteClick(user)}> <Trash2 size={16} /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <span className="text-muted small">Mostrando 1 a 4 de 100</span>
                                        <Pagination>
                                            <Pagination.Prev />
                                            <Pagination.Next />
                                        </Pagination>
                                    </div>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey={"requests"} title={<><Bell size={16} className="me-2" /> solicitaçoes de Acesso <Badge pill bg="danger">{solicitacoes.length}</Badge> </>}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Usuário</th>
                                            <th>Data da Solicitação</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitacoes.map(solicit => (
                                            <tr key={solicit.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Image src="https://cdn-icons-png.flaticon.com/512/149/149071.png" roundedCircle width="40" height="40" className="me-3" />
                                                        <div>
                                                            <div className="fw-bold">{solicit.nome}</div>
                                                            <div className="text-muted small">{solicit.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{utils.formatDateTime(solicit.createdAt)}</td>
                                                <td className="text-center">
                                                    <Button variant="success" size="sm" className="me-2 d-inline-flex align-items-center" onClick={() => aproveSolicitacao(solicit)}>
                                                        <CheckCircle size={16} className="me-1" /> Aprovar
                                                    </Button>
                                                    <Button variant="danger" size="sm" className="d-inline-flex align-items-center" onClick={() => deleteSolicitacao(solicit)}>
                                                        <XCircle size={16} className="me-1" /> Rejeitar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>

                </Tabs>
            </Container>
        </main>

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

        {/* <div className="h-100">
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
        </div> */}
    </>
    )
}

