import {
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Dropdown,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  ArrowUpDown,
  MoreVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import API from "../../app/api.js";
// import util from "../../app/utils.js"
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import HoverBtn from "@components/HoverBtn";
import ModalCadastroCliente from "@components/modal/CadastroCliente/CadastroClienteModal";
import usePopStateModal from "@hooks/usePopStateModal";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";
import PaginationControl from "@components/Pagination/PaginationControl";
import ClientDetailsModal from "./include/ClientDetailsModal";

function Clientes() {
  const [modalCadastroCliente, setModalCadastroCliente] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  const { mobile } = useOutletContext();

  const { data:clientes, isLoading, error } = API.getClientes();

  const camposFiltragem = ["id", "nome", "email", "telefone"];

  const {
    filtro,
    setFiltro,
    order,
    dadosProcessados,
    // setOrdem,
    requisitarOrdenacao,
  } = useFiltroOrdenacao(clientes || [], camposFiltragem);

  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    indexOfFirstItem,
    indexOfLastItem,
    totalItems,
    setCurrentPage,
  } = usePagination(dadosProcessados);



  // Resetar para a página 1 quando o filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [filtro, setCurrentPage]);

  usePopStateModal([modalCadastroCliente], [setModalCadastroCliente]);



  const handleShowDetails = (cliente) => {
    setSelectedClient(cliente);
    setShowDetailsModal(true);
  };

  if(isLoading) return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }} // Define a altura como 100% da altura da janela (viewport height).
    >
      {/* Componente de Spinner (rodinha girando) do Bootstrap */}
      <Spinner animation="border" variant="primary" />
    </div>
  )

  if(error) return <div>error</div> 

  return (
    <div className="">
      <div className="p-0 p-md-4">
        <Card
          className={`border-0 p-0 p-md-3 ${
            mobile ? "bg-transparent" : "shadow-sm"
          } rounded-4`}
        >
          <Card.Body className="p-1 p-md-3">
            <div className="d-flex flex-row position-relative justify-content-between align-items-start gap-4 mb-4">
              <div>
                <h2 className="h4 fw-semibold">Clientes Cadastrados</h2>
                <p className="text-muted small">
                  Gerencie e acompanhe seus clientes.
                </p>
              </div>
              {mobile ? (
                <HoverBtn
                  upClass={"position-absolute end-0"}
                  func={setModalCadastroCliente}
                  mobile={mobile}
                >
                  Adicionar Cliente
                </HoverBtn>
              ) : (
                <Button
                  onClick={() => setModalCadastroCliente(true)}
                  className="btn-roxo d-flex align-items-center gap-2"
                >
                  <Plus size={16} />
                  Cadastrar Cliente
                </Button>
              )}
            </div>

            <Row className="mb-4 g-3">
              <Col md={10}>
                <InputGroup className="flex-grow-1 h-100 rounded-4">
                  <InputGroup.Text>
                    <Search size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nome, telefone..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button
                  className="btn-roxo w-100"
                  onClick={() => {
                    requisitarOrdenacao("");
                    setFiltro("");
                  }}
                >
                  Limpar Filtros
                </Button>
              </Col>
            </Row>
            <div>
              <Card
                className={`rounded-4 ${
                  mobile ? "border-0 bg-transparent" : ""
                }`}
              >
                <Card.Header className="border-0 d-none d-md-block">
                  <Row className="py-2">
                    <Col xs={1}>
                      <span
                        className={`d-flex gap-1 ${
                          order.chave === "id" ? "fw-bold" : ""
                        }`}
                        onClick={() => requisitarOrdenacao("id")}
                        style={{ cursor: "pointer" }}
                      >
                        Id
                        {order.chave === "id" ? (
                          order.direcao === "desc" ? (
                            <ArrowUp size={17} />
                          ) : (
                            <ArrowDown size={17} />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </Col>
                    <Col md={4}>
                      <span
                        className={`d-flex gap-1 ${
                          order.chave === "nome" ? "fw-bold" : ""
                        }`}
                        onClick={() => requisitarOrdenacao("nome")}
                        style={{ cursor: "pointer" }}
                      >
                        Nome
                        {order.chave === "nome" ? (
                          order.direcao === "desc" ? (
                            <ArrowUp size={17} />
                          ) : (
                            <ArrowDown size={17} />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </Col>
                    <Col md={2}>Telefone</Col>
                    <Col md={3}>Endereço</Col>
                    <Col md={1} className="m-0 p-0 text-center">
                      <span
                        className={`${
                          order.chave === "vendas"
                            ? "fw-bold d-flex gap-1 "
                            : ""
                        }`}
                        onClick={() => requisitarOrdenacao("vendas")}
                        style={{ cursor: "pointer" }}
                      >
                        Vendas
                        {order.chave === "vendas" ? (
                          order.direcao === "desc" ? (
                            <ArrowUp size={17} />
                          ) : (
                            <ArrowDown size={17} />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </Col>
                    <Col md={1}>Ações</Col>
                  </Row>
                </Card.Header>
                <div className="list-container d-flex d-md-block flex-column gap-2">
                  {currentItems.map((cliente) => (
                    <div
                      key={cliente.id}
                      className={`hover:bg-gray-100 transition cursor-pointer ${mobile ? "card rounded-3 overflow-hidden" : ""}`}
                    >
                      <Card.Body className={`${mobile ? "" : "border-top"}`} onClick={() => mobile && handleShowDetails(cliente)}>
                        <div
                          className="position-absolute top-0 start-0 h-100 rounded-0 d-md-none"
                          style={{
                            width: "0.2rem",
                            //adicionar forma de colorir de acordo com vendas pendentes, concluidas, não pagas etc
                            backgroundColor: `${cliente.vendas.length > 0 ? "var(--bs-success)" : "var(--bs-secondary)"}`, // Example: use a CSS variable for conditional coloring
                          }}
                        ></div>
                        <Row className="g-2">
                          <Col
                            xs={2}
                            md={1}
                            className="fw-semibold fw-md-normal text-end text-md-start order-1 order-md-0"
                          >
                            <span className="d-md-none">#</span>
                            <span>{cliente.id}</span>
                          </Col>
                          <Col xs={10} md={4} className="d-flex order-0">
                            <span className="d-md-none">Nome:</span>
                            <p className="text-truncate fw-semibold fw-md-normal m-0 ms-2">
                              {cliente.nome}
                            </p>
                          </Col>
                          <Col
                            xs={12}
                            md={2}
                            className="d-flex justify-content-between order-2"
                          >
                            <span className="d-md-none">Telefone: </span>
                            <span className="text-muted">
                              {cliente.telefone}
                            </span>
                          </Col>
                          <Col
                            xs={12}
                            md={3}
                            className="d-flex justify-content-between d-none d-md-block order-3"
                          >
                            <span className="d-md-none">Endereço: </span>
                            <p className="text-muted text-truncate m-0">
                              {cliente.endereco}
                            </p>
                          </Col>
                          <hr className="d-md-none order-4 my-2" />
                          <Col
                            xs={12}
                            md={1}
                            className="d-flex d-md-block justify-content-between text-md-center fw-semibold fw-md-normal order-5"
                          >
                            <span className="d-md-none">Vendas: </span>
                            <span>{cliente.vendas.length}</span>
                          </Col>
                          <Col
                            md={1}
                            className="text-center d-none d-md-block order-last"
                          >
                            <Dropdown onClick={(e) => e.stopPropagation()}>
                              <Dropdown.Toggle
                                as="a"
                                variant="link"
                                className="dropdown-toggle-hidden-arrow text-muted p-0"
                                id={`dropdown-nota-${cliente.id}`}
                              >
                                <MoreVertical
                                  size={20}
                                  style={{ cursor: "pointer" }}
                                />
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end" renderOnMount>
                                {/* <Dropdown.Item onClick={() => handleShowDetails(nota)}>Ver Detalhes</Dropdown.Item> */}
                                <Dropdown.Item
                                  onClick={() => handleShowDetails(cliente)}
                                >
                                  Sobre
                                </Dropdown.Item>
                                {/* {nota.status !== "pago" && <Dropdown.Item onClick={() => handleBuy(nota.id)}>Pago</Dropdown.Item>} */}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Col>
                        </Row>
                      </Card.Body>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Controles de Paginação */}
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={totalItems}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            </div>
          </Card.Body>
        </Card>
        <ModalCadastroCliente
          visible={modalCadastroCliente}
          onClose={() => setModalCadastroCliente(false)}
          mobile={mobile}
        />
        <ClientDetailsModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cliente={selectedClient}
          mobile={mobile}
        />
      </div>
    </div>
  );
}

export default Clientes;
