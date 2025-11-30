import {
  Row,
  Col,
  Badge,
  Dropdown,
  ProgressBar, // 1. IMPORTE O PROGRESSBAR
  Card
} from 'react-bootstrap';
import { Plus, MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';

import utils from "@app/utils";


export default function TableNota({notas, handleShowDetails, mobile, handleBuy, handlePrintCustom}){


    const getStatusBadge = (status, full = false) => {
        switch (full) {
        case true:
            switch (status) {
            case 'pago':
                return <Badge bg="success-light" text="" pill>Pago</Badge>
            case 'pendente':
                return <Badge bg="warning" text="" pill>Pendente</Badge>
            case 'vencido':
                return <Badge bg="danger" text="" pill>Vencido</Badge>
            default:
                return <Badge bg="secondary" text="" pill>Desconhecido</Badge>
            }
        default:
            switch (status) {
            case 'pago':
                return <Badge bg="success-light" text="success" pill>Pago</Badge>
            case 'pendente':
                return <Badge bg="warning-light" text="warning" pill>Pendente</Badge>
            case 'vencido':
                return <Badge bg="danger-light" text="danger" pill>Vencido</Badge>
            default:
                return <Badge bg="secondary-light" text="secondary" pill>Desconhecido</Badge>
            }
        }
    };

    const calcItens = (itens) => { 
        const progressBarHeigth = mobile ? "6px" : "4px"
        if(itens.length === 0) {
            return (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 0, height: progressBarHeigth }}>
                    <ProgressBar style={{ height: progressBarHeigth,  borderEndEndRadius: "5px", borderEndStartRadius: "5px", borderTopRightRadius: "0", borderTopLeftRadius: "0" }}>
                        <ProgressBar variant="secondary" now={100} key={1} />
                    </ProgressBar>
                </div>
            )
        }
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
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 0, height: progressBarHeigth }}>
            <ProgressBar style={{ height: progressBarHeigth, borderEndEndRadius: "5px", borderEndStartRadius: "5px", borderTopRightRadius: "0", borderTopLeftRadius: "0" }}>
                <ProgressBar variant="success" now={contItens.disponivel} key={1} />
                <ProgressBar variant="warning" now={contItens.reservados} key={2} />
                <ProgressBar variant="danger" now={contItens.vendidos} key={3} />
            </ProgressBar>
            </div>
        )
    }

    return(
        <>
            {/* Cabeçalho da Lista (visível em telas maiores) */}
            <Row className="d-none d-md-flex text-muted fw-bold mb-2 px-3">
                <Col md={2}>Código</Col>
                <Col md={2}>Fornecedor</Col>
                <Col md={2} className="text-center">Emissão</Col>
                <Col md={2} className="text-center">Vencimento</Col>
                <Col md={1} className="text-center">Status</Col>
                <Col md={2} className="text-center">Valor</Col>
                <Col md={1} className="text-center">Ações</Col>
            </Row>
    
            {/* Itens da Lista */}
            <div className="list-container">
                {notas.map((nota) => (
                    <Card key={nota.id} className="mb-2 shadow-sm hover:scale-102 transition cursor-pointer" onClick={() => handleShowDetails(nota)}>
                    <Card.Body className="p-3">
                        <Row className="align-items-center">
                        <Col xs={6} md={2} className="mb-2 mb-md-0">
                            <span className="d-md-none text-muted small">Código: </span>
                            <span className="fw-bold">{nota.codigo}</span>
                        </Col>
                        <Col xs={6} md={2} className="mb-2 mb-md-0">
                            <span className="d-md-none text-muted small">Fornecedor: </span>
                            {nota.fornecedor || 'N/A'}
                        </Col>
                        {/* <Col xs={2} md={2} className="d-md-none text-end">
                            <span className="text-muted small">Qn. Prdts: </span>
                            {nota.itensNota.length || "N/A"}
                        </Col> */}
                        <Col xs={6} md={2} className="text-md-center mb-2 mb-md-0">
                            <span className="d-md-none text-muted small">Emissão: </span>
                            {utils.formatDate(nota.data)}
                        </Col>
                        <Col xs={6} md={2} className="text-md-center mb-2 mb-md-0">
                            <span className="d-md-none text-muted small">Vencimento: </span>
                            {utils.formatDate(nota.data_vencimento) || "N/A"}
                        </Col>
                        <hr className="my-md-2 d-md-none" />
                        <Col xs={6} md={1} className="text-md-center mb-2 mb-md-0">
                            {getStatusBadge(nota.status)}
                        </Col>
                        <Col xs={6} md={2} className="text-center fw-bold mb-2 mb-md-0">
                            {utils.formatMoney(nota.valor_total)}
                        </Col>
                        <Col xs={12} md={1} className="text-md-center d-none d-md-block">
                            <Dropdown onClick={(e) => e.stopPropagation()}>
                            <Dropdown.Toggle as="a" variant="link" className="dropdown-toggle-hidden-arrow text-muted p-0" id={`dropdown-nota-${nota.id}`}>
                                <MoreVertical size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" renderOnMount>
                                <Dropdown.Item onClick={() => handleShowDetails(nota)}>Ver Detalhes</Dropdown.Item>
                                <Dropdown.Item onClick={() => handlePrintCustom(nota)}>Baixar PDF</Dropdown.Item>
                                {nota.status !== "pago" ? <Dropdown.Item onClick={() => handleBuy(nota.id)}>Pago</Dropdown.Item> : nota.status === "vencido" ? <Dropdown.Item onClick={() => handleBuy(nota.id)}>Pago</Dropdown.Item> : null}
                            </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        </Row>
                    </Card.Body>
                    {/* Barra de Progresso */}
                    <div>
                        {calcItens(nota.itensNota)}
                    </div>
                    </Card>
                ))}
            </div>
        </>
    )
}