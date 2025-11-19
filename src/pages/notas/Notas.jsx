
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Dropdown,
  ProgressBar, // 1. IMPORTE O PROGRESSBAR
  FormControl,
} from 'react-bootstrap';
import { Plus, ArrowUpDown, Search } from 'lucide-react';
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { useOutletContext } from "react-router-dom";
import API from "@app/api";

// Seus modais existentes
import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import InvoiceDetailModal from "./include/InvoiceDetailModal"; // <-- 1. IMPORTE O NOVO MODAL

import TableNota from "./include/TableNota";
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
  
  
  // console.log(dadosProcessados)
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
      {dadosProcessados.length > 0 ? <TableNota notas={dadosProcessados} handleShowDetails={handleShowDetails} mobile={mobile} /> : (
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
        mobile={mobile}
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

