import { format } from "date-fns"
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
  ArrowUpDown 
} from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../app/api.js"

function Notas() {
  const [notas, setNotas] = useState([])
  const [selectNota, setselectNota] = useState(null);
  const [isModalOpem, setisModalOpem] = useState(false);

  const navigate = useNavigate()
  
  const handleViewProfile = (trainee) => {
    setselectNota(trainee);
    setisModalOpem(true);
  };

  const handleAssignCourse = (trainee) => {
    setselectNota(trainee);
    setIsAssignCourseOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pago':
        return <Badge bg="success">Pago</Badge>;
      case 'Pendente':
        return <Badge bg="warning">Pendente</Badge>;
      case 'Vencido':
        return <Badge bg="danger">Vencido</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const calcItens = (itens) => { 
    if(itens.length === 0) return
    const disponiveis = Object.values(itens).filter(i => i.status === "Disponivel") || 0
    const vendidos = Object.values(itens).filter(i => i.status === "Vendido") || 0
    const reservados = Object.values(itens).filter(i => i.status === "Reservado") || 0

    const contItens = {
      "disponivel": (disponiveis.length / itens.length) * 100,
      "vendidos": (vendidos.length / itens.length) * 100,
      "reservados": (reservados.length / itens.length) * 100,
      "total": itens.length
    }

    return (
      <div>
        <div className="d-flex justify-content-between mb-1">
            <small className="d-flex align-items-center text-secondary">
              <div className="me-1 rounded" style={{ width: 12, height: 12, backgroundColor: '#dc3545' }}></div>
              Vendidos
            </small>
            <small className="d-flex align-items-center text-secondary">
              <div className="me-1 rounded" style={{ width: 12, height: 12, backgroundColor: '#ffc107' }}></div>
              Reservados
            </small>
            <small className="d-flex align-items-center text-secondary">
              <div className="me-1 rounded" style={{ width: 12, height: 12, backgroundColor: '#0d6efd' }}></div>
              Disponíveis
            </small>
        </div>
        <ProgressBar>
          <ProgressBar 
              now={contItens.vendidos}
              label={`${contItens.vendidos}%`}
              variant="danger"
              key={1}
          />
          <ProgressBar 
              now={contItens.reservados}
              label={`${contItens.reservados}%`}
              variant="warning"
              key={2}
          />
          <ProgressBar 
              now={contItens.disponivel}
              label={`${contItens.disponivel}%`}
              variant="primary"
              key={3}
          />
        </ProgressBar>
    </div>
    )
    
    switch(disponiveis.length){
        case 0:
            return 100
        case itens.length:
            return 0
        default:
            return (vendidos.length / itens.length) * 100
        console.log(12)
    }
  }

  useEffect(() => {
    getNotas()
  }, [])

  const getNotas = async () => {
    const n = await API.getNotas()
    console.log(n)
    setNotas(n)
  }

  

  return (
    <div className="p-2 p-md-4">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
          <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate("/")}>
              <i className="bi bi-chevron-left"></i>
          </Button>
          <h1 className="h3 m-0">Notas</h1>
      </div>
      {/* Main Table */}
      <Card className="medical-card">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="mb-0 d-flex align-items-center">
            Notas ({notas.length})
          </Card.Title>
          <Button className="btn-roxo"><i className="bi bi-plus-lg me-2"></i> Adicionar Nota</Button>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="medical-table mb-0">
            <thead className="table-light">
              <tr>
                <th>Id</th>
                <th>Fornecedor</th>
                <th>Codigo</th>
                <th>Data</th>
                <th>Qt. Produtos</th>
                <th>Valor</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota) => (
                <tr key={nota.id}>
                  <td>
                    <div>
                      <strong className="text-dark d-block">{nota.id}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="text-secondary">{nota.fornecedor || "fornecedor aleatorio"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="text-secondary">{nota.codigo}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="text-dark d-block">{format(new Date(nota.data), "dd/MM/yyyy HH:mm")}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{nota.itensNota.length}</td>
                  <td className='text-secondary'>{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(nota.valor_total)}
                  </td>
                  <td style={{minWidth: '120px'}}>
                    {nota.itensNota.length === 0 ? (
                        <div>Nota não contem Produtos</div>
                    ) : calcItens(nota.itensNota)}
                  </td>
                  <td>{getStatusBadge("pago")}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => handleViewProfile(nota)}
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline-warning"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Profile Modal */}
      <Modal 
        show={isModalOpem} 
        onHide={() => setisModalOpem(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectNota?.name} - Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectNota && (
            <div>
              {/* Personal Information */}
              <div className="mb-4">
                <h5 className="mb-3">Personal Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <p className="mb-0">{selectNota.name}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CNIC</Form.Label>
                      <p className="mb-0">{selectNota.cnic}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <p className="mb-0">{selectNota.phone}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <p className="mb-0">{selectNota.email}</p>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Training Information */}
              <div className="mb-4">
                <h5 className="mb-3">Training Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hospital Branch</Form.Label>
                      <p className="mb-0">{selectNota.hospitalBranch}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Course</Form.Label>
                      <p className="mb-0">{selectNota.courseEnrolled}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Assigned Trainer</Form.Label>
                      <p className="mb-0">{selectNota.trainer}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Enrollment Date</Form.Label>
                      <p className="mb-0">{new Date(selectNota.enrollmentDate).toLocaleDateString()}</p>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Progress Overview */}
              <div className="mb-4">
                <h5 className="mb-3">Progress Overview</h5>
                <Row>
                  <Col md={4}>
                    <Card className="text-center medical-stats-card">
                      <Card.Body>
                        <h3 className="mb-1">{selectNota.progress}%</h3>
                        <small className="text-muted">Overall Progress</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center medical-stats-card">
                      <Card.Body>
                        <h3 className="mb-1">{selectNota.completedModules}/{selectNota.totalModules}</h3>
                        <small className="text-muted">Modules Completed</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center medical-stats-card">
                      <Card.Body>
                        <h3 className="mb-1">{selectNota.certificatesEarned}</h3>
                        <small className="text-muted">Certificates Earned</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="medical-btn-primary">
            <Download size={16} className="me-2" />
            Download Certificates
          </Button>
          <Button variant="outline-warning">
            <Edit size={16} className="me-2" />
            Edit Profile
          </Button>
          <Button variant="outline-primary">
            <BookOpen size={16} className="me-2" />
            Transfer Branch
          </Button>
          <Button variant="secondary" onClick={() => setisModalOpem(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Notas;
