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
//   ArrowUpDown 
// } from 'lucide-react';
// import { useEffect, useState } from "react";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import API from "@app/api"
// import HoverBtn from "@components/HoverBtn"
// import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
// import TableNota from "./include/TableNota"
// import ModalNota from "./include/ModalNota"

// function Notas() {
//   const [notas, setNotas] = useState([])
//   const [selectNota, setselectNota] = useState(null);
//   const [isModalOpem, setisModalOpem] = useState(false);
//   const [modalCadastroNota, setModalCadastroNota] = useState(false)

//   const { mobile } = useOutletContext()

//   const navigate = useNavigate()
  
  

//   useEffect(() => {
//     getNotas()
//   }, [])

//   const getNotas = async () => {
//     const n = await API.getNotas()
//     // console.log(n)
//     setNotas(n)
//   }
//   // console.log(selectNota)
//   return (
//     <div className="p-2 p-md-4">
//       <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
//           <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate("/")}>
//               <i className="bi bi-chevron-left"></i>
//           </Button>
//           <h1 className="h3 m-0">Notas</h1>
//           <HoverBtn upClass={'position-absolute end-0'} func={setModalCadastroNota} mobile={mobile} >Adicionar Nota</HoverBtn>
//       </div>
//       {/* Main Table */}
//       <TableNota notas={notas} setselectNota={setselectNota} setisModalOpem={setisModalOpem} />
      
//       {/* Profile Modal */}
//       <ModalNota visible={isModalOpem} onClose={() => setisModalOpem(false)} mobile={mobile} selectNota={selectNota} />
//       {
//         modalCadastroNota && (
//           <CadastroNotaModal visible={modalCadastroNota} onClose={() => setModalCadastroNota(false)} produts={true} fullScrean={true}/>
//         )
//       }
//     </div>
//   );
// }
// export default Notas;

import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Table,
  Badge,
  Pagination,
  Dropdown,
  ProgressBar // 1. IMPORTE O PROGRESSBAR
} from 'react-bootstrap';
import { Plus, MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useNavigate, useOutletContext } from "react-router-dom";
import API from "@app/api";
import utils from "@app/utils";

// Seus modais existentes
import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import InvoiceDetailModal from "./include/InvoiceDetailModal"; // <-- 1. IMPORTE O NOVO MODAL

import ModalNota from "./include/ModalNota";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [selectNota, setSelectNota] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { mobile } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    getNotas();
  }, []);

  const getNotas = async () => {
    const n = await API.getNotas();
    setNotas(n);
  };

  const handleShowDetails = (nota) => {
    setSelectNota(nota);
    setIsModalDetailOpen(true);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return { bg: 'success-light', text: 'success', label: 'Pago' };
      case 'Pending':
        return { bg: 'warning-light', text: 'warning', label: 'Pendente' };
      case 'Overdue':
        return { bg: 'danger-light', text: 'danger', label: 'Vencido' };
      default:
        return { bg: 'secondary-light', text: 'secondary', label: 'Desconhecido' };
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
        <td style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 0, height: '3px' }}>
          <ProgressBar style={{ height: '3px', borderRadius: "100px" }}>
            <ProgressBar variant="success" now={contItens.disponivel} key={1} />
            <ProgressBar variant="warning" now={contItens.reservados} key={2} />
            <ProgressBar variant="danger" now={contItens.vendidos} key={3} />
          </ProgressBar>
        </td>
    )
  }
  console.log(notas)
  return (
    <Container fluid className="py-4 px-2 px-md-4">
      {/* Cabeçalho da Página */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="h3 mb-1">Notas Fiscais</h2>
          <p className="text-muted mb-0">Gerencie e acompanhe suas notas fiscais em um só lugar.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setIsModalCadastroOpen(true)}>
            <Plus size={18} className="me-2" />
            Adicionar Nova Nota
          </Button>
        </Col>
      </Row>

      {/* Filtros e Ações */}
      <Row className="mb-4 align-items-center">
        <Col md={8} className="mb-2 mb-md-0">
          <ButtonGroup>
            {['All', 'Paid', 'Pending', 'Overdue'].map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'primary' : 'outline-secondary'}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
        <Col md={4} className=" d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                <ArrowUpDown size={16} className="me-2" />
                Ordenar por Data
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Mais Recente</Dropdown.Item>
                <Dropdown.Item href="#">Mais Antigo</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </Col>
      </Row>

      {/* Tabela de Notas */}
      <Row>
        <Col>
          <div className="table-responsive">
            <Table hover className="align-middle" >
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Fornecedor</th>
                  <th>Emissão</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th className="text-end">Valor</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {notas.map((nota) => {
                  const status = getStatusBadge('Pending');
                  // Dados de exemplo para a barra de progresso. Você precisará conectar isso aos seus dados reais.
                  const progress = { paid: 60, pending: 25, overdue: 15 };

                  return (
                    // 2. ADICIONE position: 'relative' À LINHA DA TABELA
                    <tr 
                      key={nota.id} 
                      style={{ cursor: 'pointer', position: 'relative', height: "4.5rem" }} 
                      onClick={() => handleShowDetails(nota)}
                    >
                      <td className="fw-bold">#{nota.codigo}</td>
                      <td>{nota.fornecedor || 'N/A'}</td>
                      <td>{utils.formatDate(nota.data)}</td>
                      <td>{utils.formatDate(nota.data_vencimento) || "N/A"}</td>
                      <td>
                        <Badge bg={status.bg} text={status.text} pill>{status.label}</Badge>
                      </td>
                      <td className="text-end">{utils.formatMoney(nota.valor_total)}</td>
                      <td className="text-center">
                        <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle as="a" variant="link" className="text-muted" id={`dropdown-nota-${nota.id}`}>
                            <MoreVertical size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => handleShowDetails(nota)}>Ver Detalhes</Dropdown.Item>
                            <Dropdown.Item>Editar</Dropdown.Item>
                            <Dropdown.Item>Baixar PDF</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                      {/* 3. ADICIONE A BARRA DE PROGRESSO ABSOLUTAMENTE POSICIONADA */}
                      {nota.itensNota.length === 0 ? (
                        <td style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 0, height: '3px' }}>
                          <ProgressBar style={{ height: '3px', borderRadius: "100px" }}>
                            <ProgressBar variant="secondary" now={100} key={1} />
                          </ProgressBar>
                        </td>
                      ) : calcItens(nota.itensNota)}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Paginação */}
      <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Pagination>
            <Pagination.Prev><ChevronLeft size={13} /></Pagination.Prev>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Next><ChevronRight size={13} /></Pagination.Next>
          </Pagination>
        </Col>
      </Row>

      {/* Modais */}
      {/* <ModalNota 
        visible={isModalDetailOpen} 
        onClose={() => setIsModalDetailOpen(false)} 
        mobile={mobile} 
        selectNota={selectNota} 
      /> */}
      {/* 2. SUBSTITUA O MODAL AQUI */}
      <InvoiceDetailModal 
        visible={isModalDetailOpen} 
        onClose={() => setIsModalDetailOpen(false)} 
        selectNota={selectNota} 
      />
      {isModalCadastroOpen && (
        <CadastroNotaModal 
          visible={isModalCadastroOpen} 
          onClose={() => setIsModalCadastroOpen(false)} 
          produts={true} 
          fullScrean={true}
        />
      )}
    </Container>
  );
};

