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

import { useEffect, useState, useMemo } from "react";


export default function TableNota({notas, setselectNota, setisModalOpem}){

    //ordenação
    const [ filtro, setFiltro ] = useState();
    const [ order, setOrder ] = useState({ chave: 'id', direcao: 'asc' });

    const DadosProcessados = useMemo(() => {
    let dadosFiltrados = [...notas];

    if (filtro) {
        dadosFiltrados = dadosFiltrados.filter(dados => 
        dados.fornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
        dados.codigo.toString().includes(filtro) || 
        dados.valor_total.toString().includes(filtro)
        );
    }

    dadosFiltrados.sort((a, b) => {
        const valorA = a[order.chave];
        const valorB = b[order.chave];
    
        if (valorA < valorB) return order.direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return order.direcao === 'asc' ? 1 : -1;
        return 0;
    });

    return dadosFiltrados;
    }, [notas, filtro, order])

    const requisitarOrdenacao = (chave) => {
    let direcao = 'asc';
    if (order.chave === chave && order.direcao === 'asc') {
        direcao = 'desc';
    }
    setOrder({ chave, direcao });
    }
    

    
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
      }

    return(
        <>
        {/* Main Table */}
        <Card className="medical-card">
        <Card.Header className="d-flex justify-content-between">
            <Card.Title className="mb-0 d-flex align-items-center">
            Notas ({notas.length})
            </Card.Title>
            <Form.Control 
                type='text' 
                placeholder='Filtrar por fornecedor, codigo ou valor...' 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)} 
                style={{ maxWidth: '250px' }} 
            />
        </Card.Header>
        <Card.Body className="p-0">
            <Table responsive striped hover className="medical-table mb-0">
            <thead className="table-light">
                <tr>
                <th onClick={() => requisitarOrdenacao('id')}>Id</th>
                <th onClick={() => requisitarOrdenacao('fornecedor')}>Fornecedor</th>
                <th>Codigo</th>
                <th onClick={() => requisitarOrdenacao('data')}>Data</th>
                <th>Qt. Produtos</th>
                <th onClick={() => requisitarOrdenacao('valor_total')}>Valor</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {DadosProcessados.map((nota) => (
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
        </>
    )
}