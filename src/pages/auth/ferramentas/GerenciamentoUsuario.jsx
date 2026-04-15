import {
  Container,
  Card,
  Table,
  Tabs,
  Tab,
  Button,
  Badge,
  InputGroup,
  Form,
  Image,
} from "react-bootstrap";
import { Bell, Search, User, UserPlus, Edit, Trash2, Key, IdCard } from "lucide-react";
import utils from "@services/utils";
import PaginationButtons from "@components/Pagination/PaginationButtons";
import Solicitacoes from "./include/Solicitacoes";
import { useGerenciamentoUsuario } from "@hooks/auth/useGerenciamentoUsuario";

// Modais
import UsuarioInfoModal from "@components/modal/Auth/UsuarioInfoModal";
import UsuarioSenhaModal from "@components/modal/Auth/UsuarioSenhaModal";
import UsuarioDeleteModal from "@components/modal/Auth/UsuarioDeleteModal";
import UsuarioCadastroModal from "@components/modal/Auth/UsuarioCadastroModal";
import UsuarioPermissionModal from "@components/modal/Auth/UsuarioPermissionModal";

import "../../../../public/css/components/footer.css";
import "../../../../public/css/sistem/ferramentas.css";
import { isObject } from "framer-motion";

export default function GerenciamentoUsuario() {
  const {
    solicitacoes,
    pagination,
    filtro,
    setFiltro,
    userEdit,
    userDelet,
    modalDeletUser,
    setModalDeletUser,
    modalCadastroUser,
    setModalCadastroUser,
    modalInfoUser,
    setModalInfoUser,
    modalSenha,
    setModalSenha,
    deleteSolicitacao,
    aproveSolicitacao,
    deleteUser,
    handleDeleteClick,
    handleSubmitCreate,
    handleSubmitEdit,
    handleUserEditChange,
    setUserEdit,
    handleModalSenha,
    resetSenha,
    modalPermissionUser,
    setModalPermissionUser,
    activeTab,
    setActiveTab,
  } = useGerenciamentoUsuario();

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
  } = pagination;

  const tabClassName = (tab) => `bg-transparent! border-0! py-3 transition-all ${
        activeTab === tab 
        ? "text-roxo! border-bottom! border-roxo! fw-bold" 
        : "text-muted hover:text-roxo"
    }`
    
  return (
    <>
      <main className="grow overflow-y-auto p-4 md:p-8">
        <Container fluid="xl">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Gerenciamento de Usuário
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Gerencie e modifique usuários
              </p>
            </div>
          </div>

          <Tabs
            id="user-management-tabs"
            className="mb-3"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Tab
              eventKey="users"
              title={
                <div className="flex">
                  <User size={16} className="me-3" /> Todos os Usuários
                </div>
              }
              tabClassName={tabClassName("users")}
            >
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
                    <InputGroup
                      className="mb-3 mb-sm-0"
                      style={{ maxWidth: "250px" }}
                    >
                      <InputGroup.Text>
                        <Search size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Buscar usuário..."
                        value={isObject(filtro) ? "" : filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                      />
                    </InputGroup>
                    <Button
                      variant=""
                      className="btn btn-roxo d-flex align-items-center"
                      onClick={() => setModalCadastroUser(true)}
                    >
                      <UserPlus size={16} className="me-2" />
                      Adicionar Usuário
                    </Button>
                  </div>
                  <Table responsive hover>
                    <thead className="bg-light">
                      <tr>
                        <th>Usuário</th>
                        <th>Permissões</th>
                        <th>Data de Criação</th>
                        <th className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Image
                                src={
                                  user.img ||
                                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                roundedCircle
                                width="40"
                                height="40"
                                className="me-3"
                              />
                              <div>
                                <div className="fw-bold">{user.nome}</div>
                                <div className="text-muted small">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{user.cargo}</td>
                          <td>{utils.formatDateTime(user.createdAt)}</td>
                          <td className="text-center">
                            <Button
                              variant="link"
                              size="sm"
                              className="text-secondary"
                              onClick={() => {
                                setModalPermissionUser(true);
                                setUserEdit(user);
                              }}
                            >
                              <IdCard size={16} />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-secondary"
                              onClick={() => {
                                setModalInfoUser(true);
                                setUserEdit(user);
                              }}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => handleModalSenha(user)}
                            >
                              {" "}
                              <Key size={16} />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => handleDeleteClick(user)}
                            >
                              {" "}
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="mt-4 mb-2">
                    <PaginationButtons
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      handleItemsPerPageChange={handleItemsPerPageChange}
                      indexOfFirstItem={indexOfFirstItem}
                      indexOfLastItem={indexOfLastItem}
                      totalItems={totalItems}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Tab>
            <Tab
              eventKey={"requests"}
              title={
                <div className="flex">
                  <Bell size={16} className="me-2" /> solicitaçoes de Acesso{" "}
                  {solicitacoes.length ? (
                    <Badge pill bg="danger">
                      {solicitacoes.length}
                    </Badge>
                  ) : (
                    ""
                  )}{" "}
                </div>
              }
              tabClassName={tabClassName("requests")}
            >
              <Solicitacoes
                solicitacoes={solicitacoes}
                aproveSolicitacao={aproveSolicitacao}
                deleteSolicitacao={deleteSolicitacao}
              />
            </Tab>
          </Tabs>
        </Container>
      </main>

      <UsuarioInfoModal
        show={modalInfoUser}
        onHide={() => setModalInfoUser(false)}
        user={userEdit}
        onChange={handleUserEditChange}
        onSubmit={handleSubmitEdit}
        onResetPassword={handleModalSenha}
      />

      <UsuarioPermissionModal
        show={modalPermissionUser}
        onHide={() => setModalPermissionUser(false)}
        user={userEdit}
        onChange={handleUserEditChange}
        onSubmit={handleSubmitEdit}
      />

      <UsuarioSenhaModal
        show={modalSenha}
        onHide={() => setModalSenha(false)}
        user={userEdit}
        onReset={resetSenha}
      />

      <UsuarioDeleteModal
        show={modalDeletUser}
        onHide={() => setModalDeletUser(false)}
        user={userDelet}
        onDelete={deleteUser}
      />

      <UsuarioCadastroModal
        show={modalCadastroUser}
        onHide={() => setModalCadastroUser(false)}
        onSubmit={handleSubmitCreate}
      />
    </>
  );
}
