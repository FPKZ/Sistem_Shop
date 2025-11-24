// import { 
//   Table, 
//   Card, 
//   Badge, 
//   Button, 
//   ButtonGroup, 
//   ProgressBar, 
//   Form, 
//   Row, 
//   Col,
//   Modal
// } from 'react-bootstrap';
// import { 
//   GraduationCap, 
//   User, 
//   MapPin, 
//   BookOpen, 
//   Award, 
//   Plus, 
//   Edit, 
//   Eye, 
//   UserCheck, 
//   Download, 
//   ArrowUpDown,
//   ShoppingBasket 
// } from 'lucide-react';

import { 
  Table, 
  Card, 
  Button, 
  ButtonGroup, 
  Form, 
  Row, 
  Col,
  InputGroup,
  Dropdown
} from 'react-bootstrap';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  Search,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';

import API from "../../app/api.js"
import util from "../../app/utils.js"
import { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
// import HoverBtn from '@components/HoverBtn';
import ModalCliente from '@components/modal/CadastroCliente/CadastroClienteModal';
import usePopStateModal from '@hooks/usePopStateModal';
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [modalCliente, setModalCliente] = useState(false)
  // const [filterStatus, setFilterStatus] = useState('all');
  // const [filterBranch, setFilterBranch] = useState('all');
  
  const { mobile } = useOutletContext()

  //ordenação
  const [ filtroStatus, setFiltroStatus ] = useState("Todos")

   const camposFiltragem = [
      "id",
      "nome",
      "email",
      "telefone"
  ]

  const {
      filtro,
      setFiltro,
      order,
      dadosProcessados,
      setOrdem,
      requisitarOrdenacao
  } = useFiltroOrdenacao(clientes, camposFiltragem)



  usePopStateModal([modalCliente],[setModalCliente])

  useEffect(() => {
    getClientes()
  },[])

  const getClientes = async () => {
    try {
      const c = await API.getClientes();
      setClientes(c)
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }
  // <HoverBtn upClass={'position-absolute end-0'} func={setModalCliente} mobile={mobile}>Adicionar Cliente</HoverBtn>
  return (
    <div className=''>
      
      <div className='p-3 p-md-4'>
      <Card className='border-0 shadow-sm p-3'>
        <Card.Body>
          <div className='d-flex flex-row justify-content-between align-items-start gap-4 mb-4'>
            <div>
              <h2 className='h4 fw-semibold'>Clientes Cadastrados</h2>
              <p className='text-muted small'>Gerencie e acompanhe seus clientes.</p>
            </div>
            <Button variant="primary" onClick={() => setModalCliente(true)} className='d-flex align-items-center gap-2'>
              <Plus size={16} />
              Cadastrar Cliente
            </Button>
          </div>

          <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4'>
            <InputGroup className='flex-grow-1'>
              <InputGroup.Text>
                <Search size={16} className='text-muted' />
              </InputGroup.Text>
              <Form.Control 
                type='text' 
                placeholder='Buscar por nome, e-mail...' 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)}
                className='border-start-0'
              />
            </InputGroup>
            {/* <ButtonGroup size='' className=''>
              <Button variant={filtroStatus === 'Todos' ? 'secondary' : 'outline-secondary'} onClick={() => setFiltroStatus('Todos')}>Todos</Button>
              <Button variant={filtroStatus === 'Ativos' ? 'secondary' : 'outline-secondary'} onClick={() => setFiltroStatus('Ativos')}>Ativos</Button>
              <Button variant={filtroStatus === 'Inativos' ? 'secondary' : 'outline-secondary'} onClick={() => setFiltroStatus('Inativos')}>Inativos</Button>
            </ButtonGroup> */}
          </div>
          <div>
            <Row>
              <Col xs={1}>Id</Col>
              <Col md={3}>Nome</Col>
              <Col md={3}>E-mail</Col>
              <Col md={2}>Telefone</Col>
              <Col md={2}>Endereço</Col>
              <Col md={1}>Ações</Col>
            </Row>

            <div className='list-container'>
              {dadosProcessados.map((cliente) => (
                <Card key={cliente.id}>
                  <Card.Body>
                    <Row>
                      <Col xs={1}>
                        <span>{cliente.id}</span>
                      </Col>
                      <Col md={3}>
                        <span>{cliente.nome}</span>
                      </Col>
                      <Col md={3}>
                        <span>{cliente.email}</span>
                      </Col>
                      <Col md={2}>
                        <span>{cliente.telefone}</span>
                      </Col>
                      <Col md={2}>
                        <span>{cliente.endereco}</span>
                      </Col>
                      <Col md={1}>
                        <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle as="a" variant="link" className="dropdown-toggle-hidden-arrow text-muted p-0" id={`dropdown-nota-${cliente.id}`}>
                              <MoreVertical size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end" renderOnMount>
                              {/* <Dropdown.Item onClick={() => handleShowDetails(nota)}>Ver Detalhes</Dropdown.Item> */}
                              <Dropdown.Item>Baixar PDF</Dropdown.Item>
                              {/* {nota.status !== "pago" && <Dropdown.Item onClick={() => handleBuy(nota.id)}>Pago</Dropdown.Item>} */}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
          {/* <div className='table-responsive'>
            <Table hover className='m-0 '>
              <thead className='table-light'>
                <tr>
                  <th className='d-none d-md-table-cell' onClick={() => requisitarOrdenacao('id')}>
                    Id <ArrowUpDown size={14} className='d-inline-block ms-1' />
                  </th>
                  <th onClick={() => requisitarOrdenacao('nome')}>
                    Nome <ArrowUpDown size={14} className='d-inline-block ms-1' />
                  </th>
                  <th>E-mail</th>
                  <th className='d-none d-lg-table-cell'>Telefone</th>
                  <th className='d-none d-lg-table-cell'>Endereço</th>
                  <th className='text-center' onClick={() => requisitarOrdenacao('vendas')}>Vendas</th>
                  <th className='text-end'>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosProcessados.map((cliente) => (
                  <tr key={cliente.id} className='align-middle'>
                    <td className='fw-medium d-none d-md-table-cell'>{cliente.id}</td>
                    <td className='fw-medium'>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td className='d-none d-lg-table-cell'>{cliente.telefone}</td>
                    <td className='d-none d-lg-table-cell text-truncate' style={{ maxWidth: '200px' }}>{cliente.endereco}</td>
                    <td className='text-center'>{cliente.vendas.length}</td>
                    <td>
                      <div className='d-flex justify-content-end'>
                        <ButtonGroup size='sm'>
                          <Button variant="outline-secondary" title="Visualizar">
                            <Eye size={16} />
                          </Button>
                          <Button variant="outline-primary" title="Editar">
                            <Edit size={16} />
                          </Button>
                          <Button variant="outline-danger" title="Excluir">
                            <Trash2 size={16} />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div> */}
        </Card.Body>
      </Card>
      <ModalCliente visible={modalCliente} onClose={() => setModalCliente(false)} mobile={mobile} />
    </div>
      
      {/* Tabela Clientes */}
      {/* <Card>
        <Card.Header>
          <Row>
            <Col xs={6}>
              <Card.Title className='m-0 d-flex align-items-center'>
                Clientes ({clientes.length})
              </Card.Title>
            </Col>
            <Col xs={6} className='d-flex justify-content-end'>
              <Form.Control 
                type='text' 
                placeholder='Filtrar por nome ou telefone...' 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)} 
                style={{ maxWidth: '250px' }} 
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className='p-0'>
          <Table responsive striped hover className='m-0'>
            <thead>
              <tr>
                <th onClick={() => requisitarOrdenacao('id')}>Id <ArrowUpDown size={14}/></th>
                <th onClick={() => requisitarOrdenacao('nome')}>Nome <ArrowUpDown size={14}/></th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Vendas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ClientesProcessados.map((cliente) => (
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
      <ModalCliente visible={modalCliente} onClose={() => setModalCliente(false)} mobile={mobile} /> */}
    </div>
  );
}

export default Clientes;
