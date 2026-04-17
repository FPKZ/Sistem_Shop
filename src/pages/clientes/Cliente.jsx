import { Card, Spinner } from "react-bootstrap";
import API from "@services";
import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import usePopStateModal from "@hooks/usePopStateModal";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";
import PaginationControl from "@components/Pagination/PaginationControl";

import { useClienteModals } from "@hooks/clientes/useClienteModals";
import { ClienteHeader } from "./components/ClienteHeader";
import { ClienteSearch } from "./components/ClienteSearch";
import { ClienteList } from "./components/ClienteList";
import ClienteModals from "@components/modal/Clientes/ClienteModals";

function Clientes() {
  const { mobile } = useOutletContext();

  const { data: clientes, isLoading, error } = API.getClientes();

  const {
    modals,
    setters,
    selectedClient,
    clientToDelete,
    deleteMutation,
    handlers,
  } = useClienteModals();

  const camposFiltragem = useMemo(
    () => ["id", "nome", "email", "telefone"],
    [],
  );

  const { filtro, setFiltro, order, dadosProcessados, requisitarOrdenacao } =
    useFiltroOrdenacao(clientes || [], camposFiltragem);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filtro, setCurrentPage]);

  usePopStateModal([modals.cadastro], [setters.setCadastro]);

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error) return <div>error</div>;

  return (
    <div className="p-2 pt-3 p-md-4">
      <div className="p-0 p-md-4">
        <Card
          className={`border-0 p-0 p-md-3 ${mobile ? "bg-transparent" : "shadow-sm"} rounded-4`}
        >
          <Card.Body className="p-1 p-md-3">
            <ClienteHeader
              mobile={mobile}
              onOpenCadastro={() => handlers.editClient(null)}
            />

            <ClienteSearch
              filtro={filtro}
              setFiltro={setFiltro}
              onClear={() => {
                requisitarOrdenacao("");
                setFiltro("");
              }}
            />

            <div>
              <ClienteList
                clientes={currentItems}
                order={order}
                requisitarOrdenacao={requisitarOrdenacao}
                mobile={mobile}
                onShowDetails={handlers.showDetails}
                onEditClient={handlers.editClient}
                onDeleteRequest={handlers.deleteRequest}
              />

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

        <ClienteModals
          mobile={mobile}
          modals={modals}
          setters={setters}
          handlers={handlers}
          selectedClient={selectedClient}
          clientToDelete={clientToDelete}
          deleteMutation={deleteMutation}
        />
      </div>
    </div>
  );
}

export default Clientes;
