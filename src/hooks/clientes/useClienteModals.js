import { useState } from "react";
import API from "../../app/api.js";
import { useToast } from "@contexts/ToastContext";

export function useClienteModals() {
  const [modalCadastroCliente, setModalCadastroCliente] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const { showToast } = useToast();
  const deleteMutation = API.deleteCliente();

  const handleShowDetails = (cliente) => {
    setSelectedClient(cliente);
    setShowDetailsModal(true);
  };

  const handleEditClient = (cliente) => {
    setSelectedClient(cliente);
    setModalCadastroCliente(true);
  };

  const handleDeleteRequest = (cliente) => {
    setClientToDelete(cliente);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!clientToDelete) return;

    deleteMutation.mutate(clientToDelete.id, {
      onSuccess: () => {
        showToast("Cliente excluído com sucesso", "success");
        setShowDeleteModal(false);
        setClientToDelete(null);
      },
      onError: (err) => {
        showToast(err?.message || "Erro ao excluir cliente", "error");
      },
    });
  };

  const handleCloseCadastro = () => {
    setModalCadastroCliente(false);
    setSelectedClient(null);
  };

  return {
    modals: {
      cadastro: modalCadastroCliente,
      details: showDetailsModal,
      delete: showDeleteModal,
    },
    setters: {
      setCadastro: setModalCadastroCliente,
      setDetails: setShowDetailsModal,
      setDelete: setShowDeleteModal,
    },
    selectedClient,
    setSelectedClient,
    clientToDelete,
    deleteMutation,
    handlers: {
      showDetails: handleShowDetails,
      editClient: handleEditClient,
      deleteRequest: handleDeleteRequest,
      confirmDelete: handleConfirmDelete,
      closeCadastro: handleCloseCadastro,
    },
  };
}
