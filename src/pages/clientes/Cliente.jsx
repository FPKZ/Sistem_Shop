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

import API from "../../components/app/api.js"
import { useEffect, useState } from 'react';

function Clientes() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    getClientes()
  },[])

  const getClientes = async () => {
    const c = await API.getClientes()
    setClientes(c)
    console.log(c)
  }


  return (
    <>
      <Card>
        <Card.Header className='d-flex justify-content-between'>
          <Card.Title className='m-0 d-flex align-items-center'>
            Clientes ({clientes.length})
          </Card.Title>
          <Button className='btn-roxo'><i className='bi bi-plus-lg me-2'></i>Adicionar Cliente</Button>
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
                <tr>
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
                      <span>{cliente.endereco}</span>
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
    </>
  );
}

export default Clientes;
