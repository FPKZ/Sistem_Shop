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
  ProgressBar, // 1. IMPORTE O PROGRESSBAR
  InputGroup,
  FormControl,
  Card
} from 'react-bootstrap';
import { Plus, MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { useNavigate, useOutletContext } from "react-router-dom";
import API from "@app/api";
import utils from "@app/utils";

// Seus modais existentes
import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import InvoiceDetailModal from "./include/InvoiceDetailModal"; // <-- 1. IMPORTE O NOVO MODAL

import ModalNota from "./include/ModalNota";
import HoverBtn from "@components/HoverBtn";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [selectNota, setSelectNota] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todas');
  
  const { mobile } = useOutletContext();
  // const navigate = useNavigate();

  const camposFiltragem = [
      "codigo",
      "fornecedor",
      "status",
      "data"
  ]

  const {
      // filtro,
      setFiltro,
      order,
      dadosProcessados,
      setOrdem,
      // requisitarOrdenacao
  } = useFiltroOrdenacao(notas, camposFiltragem)

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

  const handleBtnFilter = (filter) => {
    // const legenda = {
    //   "Todas": "",
    //   "Pagas": "pago",
    //   "Vencidas": "vencido",
    //   "Pendentes": "pendente"
    // }


    setActiveFilter(filter)
    setFiltro(filter === "Todas" ? "" : filter.toLocaleLowerCase())
  }
  
  const getStatusBadge = (status, full = false) => {
    switch (full) {
      case true:
        switch (status) {
          case 'pago':
            return { bg: 'success', text: '', label: 'Pago' };
          case 'pendente':
            return { bg: 'warning', text: '', label: 'Pendente' };
          case 'vencido':
            return { bg: 'danger', text: '', label: 'Vencido' };
          default:
            return { bg: 'secondary', text: '', label: 'Desconhecido' };
        }
      default:
        switch (status) {
          case 'pago':
            return { bg: 'success-light', text: 'success', label: 'Pago' };
          case 'pendente':
            return { bg: 'warning-light', text: 'warning', label: 'Pendente' };
          case 'vencido':
            return { bg: 'danger-light', text: 'danger', label: 'Vencido' };
          default:
            return { bg: 'secondary-light', text: 'secondary', label: 'Desconhecido' };
        }
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
  console.log(dadosProcessados)
  return (
    <Container fluid className="py-4 m-0 px-0">
      {/* Cabeçalho da Página */}
      <Row className="mb-4 align-items-center position-relative">
        <Col xs={9}>
          <h2 className="h3 mb-1">Notas Fiscais</h2>
          <p className="text-muted mb-0">Gerencie e acompanhe suas notas fiscais em um só lugar.</p>
        </Col>
        <Col xs={3} className="d-flex justify-content-end position-relative overflow-visible h-100">
        {mobile ? (
          <HoverBtn mobile={mobile} func={setIsModalCadastroOpen} upClass="position-absolute bottom-0">
            Cadastrar Nota
          </HoverBtn>
        ) : (
          <Button className="btn btn-roxo" onClick={() => setIsModalCadastroOpen(true)}>
            <Plus size={18} className="me-2" />
            Cadastrar Nota
          </Button>
        )}
        </Col>
      </Row>

      {/* Filtros e Ações */}
      <Row className="mb-4 align-items-center">
        <Col md={12} className="mb-3 d-flex position-relative aling-items-center">
              <FormControl type="text" placeholder="Digite sua busca..." onChange={(e) => setFiltro(e.target.value)} />
              <Search size={15} className="position-absolute end-0 me-4 mt-2" />
        </Col>
        <Col xs={6} md={6} className="mb-0 mb-md-0 d-flex ">
          <ButtonGroup size={mobile ? "sm": ""}>
            {['Todas', 'Pago', 'Pendente', 'Vencido'].map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'primary' : 'outline-secondary'}
                className={`fw-medium ${activeFilter === filter ? 'btn-roxo' : 'outline-secondary'}`}
                onClick={() => handleBtnFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
        <Col xs={6} md={6} className=" d-flex justify-content-end gap-3">
            <Dropdown align={"end"}>
              <Dropdown.Toggle variant="" className="fw-medium dropdown-toggle-hidden-arrow align-items-end d-flex" id="dropdown-sort">
                <span className="d-none d-md-inline">Ordenar por: {order.direcao === "asc" ? "Mais Recente" : "Mais Antigo"}</span>
                <ArrowUpDown size={16} className="ms-md-2" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                <Dropdown.Item href="#" onClick={() => setOrdem("asc")}>Mais Recente</Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => setOrdem("desc")}>Mais Antigo</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </Col>
      </Row>

      {/* Lista de Notas */}
      {dadosProcessados.length > 0 ? (
        <>
          {/* Cabeçalho da Lista (visível em telas maiores) */}
          <Row className="d-none d-md-flex text-muted fw-bold mb-2 px-3">
            <Col md={2}>Código</Col>
            <Col md={3}>Fornecedor</Col>
            <Col md={2} className="text-center">Emissão</Col>
            <Col md={2} className="text-center">Vencimento</Col>
            <Col md={1} className="text-center">Status</Col>
            <Col md={1} className="text-end">Valor</Col>
            <Col md={1} className="text-center">Ações</Col>
          </Row>

          {/* Itens da Lista */}
          <div className="list-container">
            {dadosProcessados.map((nota) => {
              const status = getStatusBadge(nota.status);
              return (
                <Card key={nota.id} className="mb-2 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => handleShowDetails(nota)}>
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={6} md={2} className="mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Código: </span>
                        <span className="fw-bold">{nota.codigo}</span>
                      </Col>
                      <Col xs={4} md={3} className="mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Fornecedor: </span>
                        {nota.fornecedor || 'N/A'}
                      </Col>
                      <Col xs={2} md={2} className="d-md-none text-end">
                        <span className="text-muted small">Qn. Produtos: </span>
                        {nota.itensNota.length || "N/A"}
                      </Col>
                      <Col xs={6} md={2} className="text-md-center mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Emissão: </span>
                        {utils.formatDate(nota.data)}
                      </Col>
                      <Col xs={6} md={2} className="text-md-center mb-2 mb-md-0">
                        <span className="d-md-none text-muted small">Vencimento: </span>
                        {utils.formatDate(nota.data_vencimento) || "N/A"}
                      </Col>
                      <Col xs={6} md={1} className="text-md-center mb-2 mb-md-0">
                        <Badge bg={status.bg} text={status.text} pill>{status.label}</Badge>
                      </Col>
                      <Col xs={6} md={1} className="text-end fw-bold mb-2 mb-md-0">
                        {utils.formatMoney(nota.valor_total)}
                      </Col>
                      <Col xs={12} md={1} className="text-md-center d-none d-md-block">
                        <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle as="a" variant="link" className="dropdown-toggle-hidden-arrow text-muted p-0" id={`dropdown-nota-${nota.id}`}>
                            <MoreVertical size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => handleShowDetails(nota)}>Ver Detalhes</Dropdown.Item>
                            <Dropdown.Item>Editar</Dropdown.Item>
                            <Dropdown.Item>Baixar PDF</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card.Body>
                  {/* Barra de Progresso */}
                  <div style={{ height: '4px' }}>
                    {nota.itensNota.length === 0 ? (
                      <ProgressBar style={{ height: '4px', borderBottomLeftRadius: 'calc(0.375rem - 1px)', borderBottomRightRadius: 'calc(0.375rem - 1px)' }}>
                        <ProgressBar variant="secondary" now={100} key={1} />
                      </ProgressBar>
                    ) : calcItens(nota.itensNota)}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="alert alert-roxo text-center mt-4" role="alert">
          <p className="fw-medium fs-4 m-0">Nenhuma nota encontrada!</p>
        </div>
      )}

      

      {/* Paginação */}
      {/* <Row className="mt-4 justify-content-center">
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
      </Row> */}

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

