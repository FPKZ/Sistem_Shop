import { Modal, Button, Form, Table, Badge, InputGroup } from "react-bootstrap";
import { useState } from "react";
import utils from "@app/utils";

export default function ModalAdicionarProduto({
  show,
  onHide,
  produtos,
  onAdd,
}) {
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo?.includes(busca)
  );

  const handleAdd = () => {
    if (!produtoSelecionado) return;

    if (quantidade > produtoSelecionado.estoque) {
      alert("Quantidade maior que o estoque disponível!");
      return;
    }

    onAdd({
      ...produtoSelecionado,
      quantidade: parseInt(quantidade),
    });

    // Reset
    setProdutoSelecionado(null);
    setQuantidade(1);
    setBusca("");
    onHide();
  };

  const handleSelectProduto = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade(1);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!produtoSelecionado ? (
          <>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Buscar por nome ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <div className="table-responsive" style={{ maxHeight: "400px" }}>
              <Table hover className="align-middle mb-0">
                <thead className="bg-light sticky-top">
                  <tr>
                    <th className="border-0">Produto</th>
                    <th className="border-0">Preço</th>
                    <th className="border-0">Estoque</th>
                    <th className="border-0 text-end">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados && produtosFiltrados.length > 0 ? (
                    produtosFiltrados.map((produto) => (
                      <tr
                        key={produto.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSelectProduto(produto)}
                      >
                        <td>
                          <div className="fw-bold">{produto.nome}</div>
                          <small className="text-muted">{produto.codigo}</small>
                        </td>
                        <td className="fw-bold text-success">
                          {utils.formatMoney(produto.valor_venda)}
                        </td>
                        <td>
                          <Badge
                            bg={
                              produto.estoque > 10
                                ? "success"
                                : produto.estoque > 0
                                ? "warning"
                                : "danger"
                            }
                          >
                            {produto.estoque} un.
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={produto.estoque === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduto(produto);
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
                          ? "Nenhum produto encontrado"
                          : "Nenhum produto disponível"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <div>
            <div className="border rounded p-3 mb-3 bg-light">
              <h5 className="mb-2">{produtoSelecionado.nome}</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Preço unitário:</span>
                <span className="fw-bold text-success">
                  {utils.formatMoney(produtoSelecionado.valor_venda)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Estoque disponível:</span>
                <Badge
                  bg={produtoSelecionado.estoque > 10 ? "success" : "warning"}
                >
                  {produtoSelecionado.estoque} un.
                </Badge>
              </div>
            </div>

            <Form.Group>
              <Form.Label>Quantidade</Form.Label>
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  min="1"
                  max={produtoSelecionado.estoque}
                  value={quantidade}
                  onChange={(e) =>
                    setQuantidade(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="text-center"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setQuantidade(
                      Math.min(produtoSelecionado.estoque, quantidade + 1)
                    )
                  }
                >
                  +
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Máximo: {produtoSelecionado.estoque} unidades
              </Form.Text>
            </Form.Group>

            <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Subtotal:</span>
                <h4 className="mb-0 text-primary">
                  {utils.formatMoney(
                    produtoSelecionado.valor_venda * quantidade
                  )}
                </h4>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {produtoSelecionado && (
          <Button
            variant="outline-secondary"
            onClick={() => setProdutoSelecionado(null)}
          >
            Voltar
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        {produtoSelecionado && (
          <Button variant="primary" onClick={handleAdd}>
            Adicionar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
