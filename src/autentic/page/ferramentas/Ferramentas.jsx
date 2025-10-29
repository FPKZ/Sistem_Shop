import { Container, Col, Row, Card, Table, Tabs, Tab, Button, ButtonGroup, Tooltip, OverlayTrigger, Toast, Modal, Badge, InputGroup, Form, Image, Pagination, FormGroup } from "react-bootstrap"
import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
import API from "@app/api"
import utils from "@app/utils"
import { Bell, Check, CheckCircle, Edit, PenBox, Search, Trash2, User, UserPlus, XCircle } from "lucide-react"
import ToastCuston from "@components/ToastCuston"
import "../../../../public/css/components/footer.css"
import "../../../../public/css/sistem/ferramentas.css"

export default function FerrramentasPage(){

    const [ att, setAtt ] = useState(false)
    
    const [ solicitacoes, setSolicitacoes ] = useState([])
    const [ users, setUsers ] = useState([])
    
    const [ userEdit, setUserEdit ] = useState({})
    const [ userDelet, setUserDelet ] = useState({})
    
    const [ modalDeletUser, setModalDeletUser ] = useState(false)
    const [ modalCadastroUser, setModalCadastroUser ] = useState(false)
    const [ modalInfoUser, setModalInfoUser ] = useState(false)

    const [ toast, setToast ] = useState(false)
    const [ toastMesage, setToastMesage ] = useState("")
    // const navigate = useNavigate()

    useEffect(() => {
        getSolicitacoes()
        getUsers()
    },[att])

    const getSolicitacoes = async () => {
        const solicit = await API.getSolicitacoes()
        setSolicitacoes(solicit)
    }

    const getUsers = async () => {
        const u = await API.getUsers()
        setUsers(u)
    }


    const deleteSolicitacao = async (solict) => {
        const response = await API.deleteSolicitacao(solict.id)
        if(!response.ok){
            setToastMesage(response.message || response.error)
            setToast(true)
            return
        }
        setToastMesage(response.message)
        setToast(true)
        console.log(response)
        setAtt(!att)
    }
    
    const aproveSolicitacao = async (solict) => {
        const response = await API.aproveSolicitacoes(solict.id)
        if(!response.ok){
            setToastMesage(response.message || response.error)
            setToast(true)
            return
        }
        setToastMesage(response.message)
        setToast(true)
        setAtt(!att)
    }



    const deleteUser = async (user) => {
        const response = await API.deleteUser(user.id)
        setToastMesage(response.message || response.error)
        setToast(true)
        await getUsers()
    }


    const handleDeleteClick = async (user) => {
        setUserDelet(user)
        setModalDeletUser(true)
    }

    const handleSubmitCreate = async (e) => {
        e.preventDefault()
        const form = e.target
        const result = new FormData(form)
        const data_refatorada = Object.fromEntries(result.entries())
        const response = await API.cadastrarUser(data_refatorada)
        if(!response.ok){
            console.log(response)
            setToastMesage(response.message || response.error)
            setToast(true)
            return
        }
        setModalCadastroUser(false)
        setAtt(!att)
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault()
        const form = new FormData(e.target)
        const data_refatorada = Object.fromEntries(form.entries())
        const response = await API.editarUser(data_refatorada)
        if(!response.ok){
            setToastMesage(response.message || response.error)
            setToast(true)
            return
        }
        setModalInfoUser(false)
        setAtt(!att)
    }

    const handleChange = async (e) => {
        const { name, value } = e.target
        setUserEdit((prev) => {
            const updateValues = {
                ...prev,
                [name]: value,
            }

            return updateValues

        })
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
                                    <Button variant="" className="btn btn-roxo d-flex align-items-center" onClick={() => setModalCadastroUser(true)}>
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
                                                    <Button variant="link" size="sm" className="text-secondary" onClick={() => {setUserEdit(user); setModalInfoUser(true)}}><Edit size={16} /></Button>
                                                    <Button variant="link" size="sm" className="text-danger" onClick={() => handleDeleteClick(user)}> <Trash2 size={16} /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <span className="text-muted small">Mostrando 1 a 4 de 100</span>
                                    <Pagination>
                                        <Pagination.Prev />
                                        <Pagination.Next />
                                    </Pagination>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey={"requests"} title={<><Bell size={16} className="me-2" /> solicitaçoes de Acesso {solicitacoes.length ? (<Badge pill bg="danger">{solicitacoes.length}</Badge>) : ""} </>}>
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

        <Modal show={modalInfoUser} onHide={() => setModalInfoUser(false)} size="sm" centered>
            <Modal.Header className="border-0 mb-0" closeButton >
                <Modal.Title>Editar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <Form onSubmit={handleSubmitEdit}>
                    <Row className="g-4">
                        <Form.Control type="hidden" name="id" value={userEdit.id} onChange={handleChange} required/>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control type="text" name="nome" value={userEdit.nome} onChange={handleChange} required/>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="text" name="email" value={userEdit.email} onChange={handleChange} required/>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Permissão:</Form.Label>
                                <Form.Select type="text" name="cargo" value={userEdit.cargo} onChange={handleChange} required>
                                    <option>User</option>
                                    <option>Adm</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Button className="btn btn-roxo w-100" type="submit">Alterar</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>

        <Modal show={modalDeletUser} onHide={() => setModalDeletUser(false)} size="sm" centered backdrop={false}>
            <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
                    <Row>
                        <Modal.Title>Deseja excluir o usuario</Modal.Title>
                    </Row>
                    <Row><Modal.Title>{userDelet.nome}</Modal.Title></Row>
                    <Row className="mt-3">
                        <Col className="d-flex gap-2">
                            <Button variant="success" onClick={() => {deleteUser(userDelet); setModalDeletUser(false)}}>Excluir</Button>
                            <Button variant="danger" onClick={() => setModalDeletUser(false)}>Cancelar</Button>
                        </Col>
                    </Row>
            </Modal.Body>
        </Modal>

        <Modal show={modalCadastroUser} onHide={() => setModalCadastroUser(false)} size="sm" centered  >
            <Modal.Header className="border-0 mb-0" closeButton >
                <Modal.Title>Cadastrar Novo Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4">
                <Form onSubmit={handleSubmitCreate}>
                    <Row className="g-4">
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control type="text" name="nome" placeholder="João da Silva" required/>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="text" name="email" placeholder="joaoSilva@gmail.com" required/>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Senha:</Form.Label>
                                <Form.Control type="senha" name="senha" placeholder="mudar123" required/>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Permissão:</Form.Label>
                                <Form.Select type="text" name="cargo" required>
                                    <option>User</option>
                                    <option>Adm</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Button className="btn btn-roxo w-100" type="submit">Cadastrar</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
        {/* <Button onClick={() => setToast(true)} >toast</Button> */}
        <ToastCuston visible={toast} onClose={() => setToast(false)} >{toastMesage}</ToastCuston>
    </>
    )
}