import { Modal, Button, Form, Table, Badge, Spinner } from "react-bootstrap";
import { useState } from "react";
import API from "@app/api";
import { Alert } from "bootstrap";

export default function ModalSelecionarCliente({
  show,
  onHide,
  onSelect,
}) {
  const [busca, setBusca] = useState("");
  const { data: clientes, isLoading, error } = API.getClientes();

  // Verifica se a aplicação está em estado de carregamento (loading).
  if (isLoading) {
    // Se estiver carregando, retorna um componente visual de "Loading" (Spinner) centralizado na tela.
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }} // Define a altura como 100% da altura da janela (viewport height).
      >
        {/* Componente de Spinner (rodinha girando) do Bootstrap */}
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if(error) return (
    <Alert className="alert-roxo">
      {error.message}
    </Alert>
  )

  const clientesFiltrados = clientes?.filter(
    (cliente) =>
      cliente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.telefone?.includes(busca)
  );

  const handleSelect = (cliente) => {
    onSelect(cliente);
    onHide();
    setBusca("");
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down" centered>
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
          />
        </Form.Group>

        <div className="table-responsive" style={{ maxHeight: "400px" }}>
          <Table hover className="align-middle mb-0">
            <thead className="bg-light sticky-top">
              <tr>
                <th className="border-0">Nome</th>
                <th className="border-0">Telefone</th>
                <th className="border-0">Email</th>
                <th className="border-0 text-end">Ação</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados && clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelect(cliente)}
                  >
                    <td className="fw-bold">{cliente.nome}</td>
                    <td>{cliente.telefone || "N/A"}</td>
                    <td className="text-muted small">
                      {cliente.email || "N/A"}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(cliente);
                        }}
                      >
                        Selecionar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    {busca
                      ? "Nenhum cliente encontrado"
                      : "Nenhum cliente cadastrado"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
