import ModalCadastroCliente from "@components/modal/CadastroCliente/CadastroClienteModal";
import ClientDetailsModal from "./ClientDetailsModal";
import { Modal as RSModal, Button, Spinner } from "react-bootstrap";
import { Trash2 } from "lucide-react";

export default function ClienteModals({
  mobile,
  modals,
  setters,
  handlers,
  selectedClient,
  clientToDelete,
  deleteMutation,
}) {
  return (
    <>
      <ModalCadastroCliente
        visible={modals.cadastro}
        onClose={handlers.closeCadastro}
        clienteParaEditar={selectedClient}
        mobile={mobile}
      />

      <ClientDetailsModal
        show={modals.details}
        onHide={() => setters.setDetails(false)}
        cliente={selectedClient}
        mobile={mobile}
      />

      <RSModal
        show={modals.delete}
        onHide={() => setters.setDelete(false)}
        centered
        size="sm"
      >
        <RSModal.Header closeButton className="border-0">
          <RSModal.Title className="h5 fw-bold">
            Confirmar Exclusão
          </RSModal.Title>
        </RSModal.Header>
        <RSModal.Body className="text-center pb-4">
          <div className="mb-3 text-danger d-flex justify-content-center">
            <Trash2 size={48} />
          </div>
          <p className="mb-0">
            Tem certeza que deseja excluir o cliente{" "}
            <strong>{clientToDelete?.nome}</strong>?
          </p>
          <p className="small text-muted mt-2">
            Esta ação não poderá ser desfeita.
          </p>
        </RSModal.Body>
        <RSModal.Footer className="border-0 pt-0 d-flex justify-content-center gap-2">
          <Button
            variant="light"
            onClick={() => setters.setDelete(false)}
            className="px-4"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handlers.confirmDelete}
            disabled={deleteMutation.isPending}
            className="px-4"
          >
            {deleteMutation.isPending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Excluir"
            )}
          </Button>
        </RSModal.Footer>
      </RSModal>
    </>
  );
}
