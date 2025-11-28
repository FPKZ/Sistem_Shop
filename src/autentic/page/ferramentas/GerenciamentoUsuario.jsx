import { Container, Col, Row, Card, Table, Tabs, Tab, Button, ButtonGroup, Tooltip, OverlayTrigger, Toast, Modal, Badge, InputGroup, Form, Image, Pagination, FormGroup } from "react-bootstrap"
import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
import API from "@app/api"
import utils from "@app/utils"
import { Bell, Check, CheckCircle, Edit, PenBox, Search, Trash2, User, UserPlus, XCircle } from "lucide-react"
import { useToast } from "@contexts/ToastContext"
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao"
import "../../../../public/css/components/footer.css"
import "../../../../public/css/sistem/ferramentas.css"

import Solicitacoes from "./include/Solicitacoes"

//paginação
import { usePagination } from "@hooks/usePagination"
import PaginationButtons from "@components/Pagination/PaginationButtons"

export default function GerenciamentoUsuario(){

    const [ att, setAtt ] = useState(false)
    
    const [ solicitacoes, setSolicitacoes ] = useState([])
    const [ users, setUsers ] = useState([])
    
    const [ userEdit, setUserEdit ] = useState({})
    const [ userDelet, setUserDelet ] = useState({})
    
    const [ modalDeletUser, setModalDeletUser ] = useState(false)
    const [ modalCadastroUser, setModalCadastroUser ] = useState(false)
    const [ modalInfoUser, setModalInfoUser ] = useState(false)

    const [ modalSenha, setModalSenha ] = useState(false)


    const { showToast } = useToast()

    // const navigate = useNavigate()

    const camposFiltragem = [
        "nome",
        "email",
        "cargo",
        "createdAt"
    ]

    const {
        filtro,
        setFiltro,
        // order,
        dadosProcessados,
        // requisitarOrdenacao
    } = useFiltroOrdenacao(users, camposFiltragem)

    const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    indexOfFirstItem,
    indexOfLastItem,
    totalItems
  } = usePagination(dadosProcessados, 10);

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
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
        setAtt(!att)
    }
    
    const aproveSolicitacao = async (solict) => {
        const response = await API.aproveSolicitacoes(solict.id)
        if(!response.ok){
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
        setAtt(!att)
    }



    const deleteUser = async (user) => {
        const response = await API.deleteUser(user.id)
        if(!response.ok){
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
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
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
        setModalCadastroUser(false)
        setAtt(!att)
    }

    const handleSubmitEdit = async (e) => {
        e.preventDefault()
        const form = new FormData(e.target)
        const data_refatorada = Object.fromEntries(form.entries())
        const response = await API.editarUser(data_refatorada)
        if(!response.ok){
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
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

    const handleModalSenha = (user) => {
        setUserEdit(user)
        setModalSenha(true)
    }

    const resetSenha = async () => {
        const response = await API.resetSenha(userEdit.id)
        if(!response.ok){
            showToast(response.message || response.error, "error")
            return
        }
        showToast(response.message, "success")
        setModalSenha(false)
        setAtt(!att)
    }

    return (<>

        <main className="flex-grow-1 overflow-auto p-2 p-sm-6 p-md-8" >
            <Container fluid="xl">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white" >Gerenciamento de Usuário</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie e modifique usuários</p>
                    </div>
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
                                        <Form.Control placeholder="Buscar usuário..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
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
                                        {currentItems.map(user => (
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
                                <div className="mt-4 mb-2">
                                    <PaginationButtons
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        handlePageChange={handlePageChange}
                                        itemsPerPage={itemsPerPage}
                                        handleItemsPerPageChange={handleItemsPerPageChange}
                                        indexOfFirstItem={indexOfFirstItem}
                                        indexOfLastItem={indexOfLastItem}
                                        totalItems={totalItems}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey={"requests"} title={<><Bell size={16} className="me-2" /> solicitaçoes de Acesso {solicitacoes.length ? (<Badge pill bg="danger">{solicitacoes.length}</Badge>) : ""} </>}>
                        <Solicitacoes solicitacoes={solicitacoes} aproveSolicitacao={aproveSolicitacao} deleteSolicitacao={deleteSolicitacao}/>
                    </Tab>
                </Tabs>
            </Container>
        </main>

        <Modal show={modalInfoUser} onHide={() => setModalInfoUser(false)} size="md" centered>
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
                            <Button size="sm" className="btn-roxo w-100" onClick={() => handleModalSenha(userEdit)}>Resetar Senha</Button>
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

        <Modal show={modalSenha} onHide={() => setModalSenha(false)} size="md" centered backdrop={false}>
            <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
                    <Row>
                        <Modal.Title>Deseja resetar a senha do usuario?</Modal.Title>
                    </Row>
                    <Row><Modal.Title>{userDelet.nome}</Modal.Title></Row>
                    <Row className="mt-3">
                        <Col className="d-flex gap-2">
                            <Button variant="success" onClick={() => resetSenha()}>Resetar</Button>
                            <Button variant="danger" onClick={() => setModalSenha(false)}>Cancelar</Button>
                        </Col>
                    </Row>
            </Modal.Body>
        </Modal>

        <Modal show={modalDeletUser} onHide={() => setModalDeletUser(false)} size="md" centered backdrop={false}>
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

        <Modal show={modalCadastroUser} onHide={() => setModalCadastroUser(false)} size="md" centered  >
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
    </>
    )
}