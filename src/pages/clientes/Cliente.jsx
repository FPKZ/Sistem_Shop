import { 
  Table, 
  Card, 
  Badge, 
  Button, 
  ButtonGroup, 
  ProgressBar, 
  Form, 
  Row, 
  Col,
  Modal
} from 'react-bootstrap';
import { 
  GraduationCap, 
  User, 
  MapPin, 
  BookOpen, 
  Award, 
  Plus, 
  Edit, 
  Eye, 
  UserCheck, 
  Download, 
  ArrowUpDown,
  ShoppingBasket 
} from 'lucide-react';

import API from "../../app/api.js"
import util from "../../app/utils.js"
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import HoverBtn from '@components/HoverBtn';
import ModalCliente from '@components/modal/CadastroCliente/CadastroClienteModal';
import usePopStateModal from '@hooks/usePopStateModal';

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [modalCliente, setModalCliente] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const { mobile } = useOutletContext()

  const navigate = useNavigate()
  usePopStateModal([modalCliente],[setModalCliente])

  useEffect(() => {
    getClientes()
  },[])

  const getClientes = async () => {
    const c = await API.getClientes()
    setClientes(c)
    console.log(c)
  }

  return (
    <div className='p-2 p-md-4'>
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
          <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate("/")}>
              <i className="bi bi-chevron-left"></i>
          </Button>
          <h1 className="h3 m-0">Clientes</h1>
          <HoverBtn upClass={'position-absolute end-0'} func={setModalCliente} mobile={mobile}>Adicionar Cliente</HoverBtn>
      </div>
      {/* Filters */}
      <Card className="medical-card mb-4">
        <Card.Header>
          <Card.Title className="mb-0">Filters</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Id</Form.Label>
                <Form.Select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos Ids</option>
                  {clientes.map(status => (
                    <option key={status.id} value={status.id}>{status.id}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Select 
                  value={filterBranch} 
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <option value="all">All Branches</option>
                  {clientes.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="outline-secondary" className="w-100">
                <ArrowUpDown size={16} className="me-2" />
                Sort
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Tabela Clientes */}
      <Card>
        <Card.Header>
          <Row>
            <Col xs={6}>
              <Card.Title className='m-0 d-flex align-items-center'>
                Clientes ({clientes.length})
              </Card.Title>
            </Col>
              <Col md={2}>
                <Form.Group className='d-flex'>
                  <Form.Label className="align-items-end d-flex me-2">Id:</Form.Label>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos Ids</option>
                    {clientes.map(status => (
                      <option key={status.id} value={status.id}>{status.id}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className='d-flex'>
                  <Form.Label className="align-items-end d-flex me-2">Nome:</Form.Label>
                  <Form.Select 
                    value={filterBranch} 
                    onChange={(e) => setFilterBranch(e.target.value)}
                  >
                    <option value="all">All Branches</option>
                    {clientes.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="outline-secondary" className="w-100">
                  <ArrowUpDown size={16} className="me-2" />
                  Sort
                </Button>
              </Col>
          </Row>
        </Card.Header>
        <Card.Body className='p-0'>
          <Table responsive striped hover className='m-0'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Vendas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>
                    <div>
                      <strong>{cliente.id}</strong>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{cliente.nome}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{cliente.email}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{cliente.telefone}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{util.capitalize(cliente.endereco, 20)}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{cliente.vendas.length}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <ButtonGroup size='sm'>
                        <Button
                        variant="outline-secondary"
                        title="View Profile"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                        variant='outline-success'
                        title='New Venda'>
                          <ShoppingBasket size={16}/>
                        </Button>
                        <Button
                        variant="outline-warning"
                        title="Edit">
                          <Edit size={16} />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <ModalCliente visible={modalCliente} onClose={() => setModalCliente(false)} mobile={mobile} />
    </div>
  );
}

export default Clientes;
