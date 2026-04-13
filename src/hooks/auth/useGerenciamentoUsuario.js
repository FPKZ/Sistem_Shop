import { useState, useEffect } from "react";
import API from "@services";
import { useRequestHandler } from "@hooks/useRequestHandler";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";
import { useForm } from "@hooks/useForm";

export function useGerenciamentoUsuario() {
  const [att, setAtt] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [users, setUsers] = useState([]);
  const [userDelet, setUserDelet] = useState({});

  const [modalDeletUser, setModalDeletUser] = useState(false);
  const [modalCadastroUser, setModalCadastroUser] = useState(false);
  const [modalInfoUser, setModalInfoUser] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);

  const { isLoading, handleRequest } = useRequestHandler();

  const {
    formValue: userEdit,
    setFormValue: setUserEdit,
    handleChange: handleUserEditChange,
  } = useForm();

  const camposFiltragem = ["nome", "email", "cargo", "createdAt"];

  const { filtro, setFiltro, dadosProcessados } = useFiltroOrdenacao(
    users,
    camposFiltragem,
  );

  const pagination = usePagination(dadosProcessados, 10);

  useEffect(() => {
    getSolicitacoes();
    getUsers();
  }, [att]);

  const getSolicitacoes = async () => {
    const solicit = await API.getSolicitacoes();
    setSolicitacoes(solicit);
  };

  const getUsers = async () => {
    const u = await API.getUsers();
    setUsers(u);
  };

  const deleteSolicitacao = async (solict) => {
    const response = await handleRequest(() =>
      API.deleteSolicitacao(solict.id),
    );
    if (response?.ok) setAtt(!att);
  };

  const aproveSolicitacao = async (solict) => {
    const response = await handleRequest(() =>
      API.aproveSolicitacoes(solict.id),
    );
    if (response?.ok) setAtt(!att);
  };

  const deleteUser = async () => {
    const response = await handleRequest(() => API.deleteUser(userDelet.id));
    if (response?.ok) {
      setModalDeletUser(false);
      getUsers();
    }
  };

  const handleDeleteClick = (user) => {
    setUserDelet(user);
    setModalDeletUser(true);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const result = new FormData(e.target);
    const data = Object.fromEntries(result.entries());

    const response = await handleRequest(() => API.cadastrarUser(data));
    if (response?.ok) {
      setModalCadastroUser(false);
      setAtt(!att);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const response = await handleRequest(() => API.editarUser(userEdit));
    if (response?.ok) {
      setModalInfoUser(false);
      setAtt(!att);
    }
  };

  const handleModalSenha = (user) => {
    setUserEdit(user);
    setModalSenha(true);
  };

  const resetSenha = async () => {
    const response = await handleRequest(() => API.resetSenha(userEdit.id));
    if (response?.ok) {
      setModalSenha(false);
      setAtt(!att);
    }
  };

  return {
    solicitacoes,
    users: dadosProcessados,
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
    handleModalSenha,
    resetSenha,
    isLoading, // Exportando loading para feedback visual opcional no componente
  };
}
