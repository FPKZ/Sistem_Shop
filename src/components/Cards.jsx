import { Row, Col, Card } from "react-bootstrap"
export default function Cards(){

    return(
        <>
            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={3}>
                <Card className="medical-card h-100">
                    <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <small className="text-muted">Total Trainees</small>
                        <h3 className="mb-0">{traineesData.length}</h3>
                        <small className="text-primary">Enrolled</small>
                        </div>
                        <GraduationCap size={32} className="text-success" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
                <Col md={3}>
                <Card className="medical-card h-100">
                    <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <small className="text-muted">Active Training</small>
                        <h3 className="mb-0">{traineesData.filter(t => t.status === 'Active').length}</h3>
                        <small className="text-success">In progress</small>
                        </div>
                        <UserCheck size={32} className="text-success" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
                <Col md={3}>
                <Card className="medical-card h-100">
                    <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <small className="text-muted">Completed</small>
                        <h3 className="mb-0">{traineesData.filter(t => t.status === 'Completed').length}</h3>
                        <small className="text-primary">Graduated</small>
                        </div>
                        <Award size={32} className="text-primary" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
                <Col md={3}>
                <Card className="medical-card h-100">
                    <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <small className="text-muted">Avg Progress</small>
                        <h3 className="mb-0">
                            {Math.round(traineesData.reduce((sum, t) => sum + t.progress, 0) / traineesData.length)}%
                        </h3>
                        <small className="text-warning">Completion rate</small>
                        </div>
                        <BookOpen size={32} className="text-warning" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </>
    )
}