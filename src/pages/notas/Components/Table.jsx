// TraineesModule.jsx (convertida)
import { useState } from 'react';
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

const traineesData = [
  {
    id: 1,
    name: 'Dr. Aisha Khan',
    cnic: '12345-6789012-3',
    phone: '+92-300-1234567',
    email: 'aisha.khan@email.com',
    hospitalBranch: 'Downtown Medical Center',
    courseEnrolled: 'Advanced Cardiology',
    trainer: 'Dr. Ahmed Hassan',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    progress: 75,
    completedModules: 6,
    totalModules: 8,
    certificatesEarned: 2
  },
  {
    id: 2,
    name: 'Dr. Muhammad Ali',
    cnic: '12345-6789012-4',
    phone: '+92-301-2345678',
    email: 'muhammad.ali@email.com',
    hospitalBranch: 'City General Hospital',
    courseEnrolled: 'Emergency Medicine',
    trainer: 'Dr. Fatima Sheikh',
    enrollmentDate: '2024-02-01',
    status: 'Active',
    progress: 60,
    completedModules: 4,
    totalModules: 8,
    certificatesEarned: 1
  },
  {
    id: 3,
    name: 'Dr. Fatima Malik',
    cnic: '12345-6789012-5',
    phone: '+92-302-3456789',
    email: 'fatima.malik@email.com',
    hospitalBranch: 'Capital Health Center',
    courseEnrolled: 'Pediatric Care',
    trainer: 'Dr. Hassan Raza',
    enrollmentDate: '2023-11-20',
    status: 'Completed',
    progress: 100,
    completedModules: 10,
    totalModules: 10,
    certificatesEarned: 3
  },
  {
    id: 4,
    name: 'Dr. Omar Sheikh',
    cnic: '12345-6789012-6',
    phone: '+92-303-4567890',
    email: 'omar.sheikh@email.com',
    hospitalBranch: 'Regional Medical Complex',
    courseEnrolled: 'Basic Surgery',
    trainer: 'Dr. Ayesha Malik',
    enrollmentDate: '2024-03-10',
    status: 'Dropped',
    progress: 25,
    completedModules: 2,
    totalModules: 8,
    certificatesEarned: 0
  }
];

const courses = [
  'Advanced Cardiology',
  'Emergency Medicine',
  'Pediatric Care',
  'Basic Surgery',
  'Diagnostic Imaging',
  'Internal Medicine',
  'Neurology Basics',
  'Orthopedic Care'
];

const branches = [
  'Downtown Medical Center',
  'City General Hospital',
  'Capital Health Center',
  'Regional Medical Complex'
];

export default function TraineesModule({notas}) {
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAssignCourseOpen, setIsAssignCourseOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');

  const filteredTrainees = traineesData.filter(trainee => {
    const statusMatch = filterStatus === 'all' || trainee.status.toLowerCase() === filterStatus;
    const branchMatch = filterBranch === 'all' || trainee.hospitalBranch === filterBranch;
    return statusMatch && branchMatch;
  });

  const handleViewProfile = (trainee) => {
    setSelectedTrainee(trainee);
    setIsProfileOpen(true);
  };

  const handleAssignCourse = (trainee) => {
    setSelectedTrainee(trainee);
    setIsAssignCourseOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge bg="success">Active</Badge>;
      case 'Completed':
        return <Badge bg="primary">Completed</Badge>;
      case 'Dropped':
        return <Badge bg="danger">Dropped</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getProgressVariant = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'primary';
    if (progress >= 40) return 'warning';
    return 'danger';
  };

  const calcItens = (itens) => { 
    if(itens.length === 0) return
    const disponiveis = Object.values(itens).filter(i => i.status === "Disponivel") || 0
    const vendidos = Object.values(itens).filter(i => i.status === "Vendido") || 0
    const reservados = Object.values(itens).filter(i => i.status === "Reservado") || 0
    const calc = vendidos.length / itens.length
    
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

  return (
    <div>

      

      {/* Filters */}
      <Card className="medical-card mb-4">
        <Card.Header>
          <Card.Title className="mb-0">Filters</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Hospital Branch</Form.Label>
                <Form.Select 
                  value={filterBranch} 
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <option value="all">All Branches</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
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

      {/* Main Table */}
      <Card className="medical-card">
        <Card.Header>
          <Card.Title className="mb-0">
            Trainee Directory ({filteredTrainees.length})
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="medical-table mb-0">
            <thead className="table-light">
              <tr>
                <th>Id</th>
                <th>Codigo</th>
                <th>Data</th>
                <th>Quantidade de Produtos</th>
                <th>Valor</th>
                <th>Progress</th>
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
                      <span className="text-secondary">{nota.codigo}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong className="text-dark d-block">{nota.data}</strong>
                    </div>
                  </td>
                  <td className="text-secondary">{nota.itensNota.length}</td>
                  <td className='text-secondary'>R$ {nota.valor_total}</td>
                  <td style={{minWidth: '120px'}}>
                    {nota.itensNota.length === 0 ? (
                        <div>Nota não contem Produtos</div>
                    ) : (
                        <div>
                            <div className="d-flex justify-content-between mb-1">
                                <small className="text-secondary">{calcItens(nota.itensNota)}%</small>
                            </div>
                            <ProgressBar 
                                now={calcItens(nota.itensNota)}
                                variant={getProgressVariant(calcItens(nota.itensNota))}
                                style={{height: '8px'}}
                            />
                        </div>
                    )}
                  </td>
                  <td>{getStatusBadge(nota.valor_total)}</td>
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
                        variant="outline-primary" 
                        onClick={() => handleAssignCourse(nota)}
                        title="Assign Course"
                      >
                        <BookOpen size={16} />
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
        show={isProfileOpen} 
        onHide={() => setIsProfileOpen(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedTrainee?.name} - Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrainee && (
            <div>
              {/* Personal Information */}
              <div className="mb-4">
                <h5 className="mb-3">Personal Information</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <p className="mb-0">{selectedTrainee.name}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CNIC</Form.Label>
                      <p className="mb-0">{selectedTrainee.cnic}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <p className="mb-0">{selectedTrainee.phone}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <p className="mb-0">{selectedTrainee.email}</p>
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
                      <p className="mb-0">{selectedTrainee.hospitalBranch}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Course</Form.Label>
                      <p className="mb-0">{selectedTrainee.courseEnrolled}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Assigned Trainer</Form.Label>
                      <p className="mb-0">{selectedTrainee.trainer}</p>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Enrollment Date</Form.Label>
                      <p className="mb-0">{new Date(selectedTrainee.enrollmentDate).toLocaleDateString()}</p>
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
                        <h3 className="mb-1">{selectedTrainee.progress}%</h3>
                        <small className="text-muted">Overall Progress</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center medical-stats-card">
                      <Card.Body>
                        <h3 className="mb-1">{selectedTrainee.completedModules}/{selectedTrainee.totalModules}</h3>
                        <small className="text-muted">Modules Completed</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="text-center medical-stats-card">
                      <Card.Body>
                        <h3 className="mb-1">{selectedTrainee.certificatesEarned}</h3>
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
          <Button variant="secondary" onClick={() => setIsProfileOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assign Course Modal */}
      <Modal 
        show={isAssignCourseOpen} 
        onHide={() => setIsAssignCourseOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Course to {selectedTrainee?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Course</Form.Label>
            <Form.Select>
              <option value="">Choose course</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="medical-btn-primary">
            Assign Course
          </Button>
          <Button variant="secondary" onClick={() => setIsAssignCourseOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}