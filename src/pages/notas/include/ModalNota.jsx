import { Modal, Row, Col, Form, Card, Button } from "react-bootstrap"
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

export default function ModalNota({visible, onClose, mobile, selectNota}){

    return (
        <Modal 
        show={visible} 
        onHide={onClose} 
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
            <Button variant="secondary" onClick={onClose}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
    )
}