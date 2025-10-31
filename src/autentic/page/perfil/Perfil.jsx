import React from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Navbar, Nav } from 'react-bootstrap';
import { Home, ShoppingBag, Plus, LayoutGrid, Receipt, BarChart, Bell, Pencil } from 'lucide-react';



export default function PerfilPage(){


    return(
        <Row>
            <Col className="d-flex flex-column overflow-hidden">
                <main className="flex-grow-1 overflow-y-auto p-4 md:p-8">
                    <Container fluid="xl" className='d-flex flex-column gap-4'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Meu Perfil</h2>
                            <p className="text-gray-500 mt-1">Gerencie as informações do seu perfil e senha.</p>
                        </div>

                        <Card className="shadow-md mb-8">
                            <Card.Header as="h3" className="text-xl font-semibold">Informações Pessoais</Card.Header>
                            <Card.Body>
                            <Form>
                                <Row className="align-items-center">
                                <Col xs="auto" className="text-center mb-4 mb-md-0">
                                    <div className="position-relative d-inline-block">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgI_tQjxP6nWW7J19a2eyRLQHdzGRXd6aEPEDceI89NfMlHQPPg-mDXggu2ORMnhcgU3nbnVTZeU2CH_LJt_zZFLzM-agpJX3MnfkoRCn7sr8-RuXrj7gR0ImONTjbgHX3FV76TKo_HHMKCPxO7kX0ke4x0qbneVli4Hcga7R7PW6Ufs0vLXOfkrR3-Y_ikZMn3xKoidBBDmXE4Ob-Hd-yD13m4pidsJ2Vwi-_Cv0hppVlQBKSYjC_HviMeYOaXah2EUDyRWlSSj58"
                                        alt="User avatar"
                                        style={{ width: '6rem', height: '6rem' }}
                                        roundedCircle
                                    />
                                    <Button
                                        variant="primary"
                                        className="position-absolute bottom-0 end-0 p-1 rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '2rem', height: '2rem' }}
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    </div>
                                </Col>
                                <Col>
                                    <Form.Group controlId="name" className="mb-4">
                                    <Form.Label>Nome Completo</Form.Label>
                                    <Form.Control type="text" defaultValue="João da Silva" />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                    <Form.Label>Endereço de E-mail</Form.Label>
                                    <Form.Control type="email" defaultValue="joao.silva@example.com" />
                                    </Form.Group>
                                </Col>
                                </Row>
                                <div className="d-flex justify-content-end mt-4">
                                <Button variant="primary" type="submit">
                                    Salvar Alterações
                                </Button>
                                </div>
                            </Form>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-md">
                            <Card.Header as="h3" className="text-xl font-semibold">Alterar Senha</Card.Header>
                            <Card.Body>
                            <Form>
                                <Form.Group controlId="current-password" a className="mb-3">
                                <Form.Label>Senha Atual</Form.Label>
                                <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group controlId="new-password" a className="mb-3">
                                <Form.Label>Nova Senha</Form.Label>
                                <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group controlId="confirm-password" a className="mb-3">
                                <Form.Label>Confirmar Nova Senha</Form.Label>
                                <Form.Control type="password" />
                                </Form.Group>
                                <div className="d-flex justify-content-end mt-4">
                                <Button variant="primary" type="submit">
                                    Atualizar Senha
                                </Button>
                                </div>
                            </Form>
                            </Card.Body>
                        </Card>
                    </Container>
                </main>
            </Col>
        </Row>
    )
}