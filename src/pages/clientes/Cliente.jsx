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
      <Card>
        <Card.Header className='d-flex justify-content-between'>
          <Card.Title className='m-0 d-flex align-items-center'>
            Clientes ({clientes.length})
          </Card.Title>
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
