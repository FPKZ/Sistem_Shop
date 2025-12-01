import { Row, Col, Card, Button, Form, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import utils from "@app/utils";
import API from "@app/api";
import ModalSelecionarCliente from "./include/ModalSelecionarCliente";
import ModalAdicionarProduto from "./include/ModalAdicionarProduto";
import ModalAdicionarPagamento from "./include/ModalAdicionarPagamento";
import { Pencil, Trash, Trash2, Trash2Icon, TrashIcon } from "lucide-react";

export default function NovaVenda() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [listaVenda, setListaVenda] = useState([]);

  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);

  const [pagamentos, setPagamentos] = useState([]);
  const [pagamento, setPagamento] = useState(null);
  const [showModalPagamento, setShowModalPagamento] = useState(false);

  const [desconto, setDesconto] = useState(0);

  useEffect(() => {
    getClientes();
    getProdutos();
  }, []);

  

  const getClientes = async () => {
    const c = await API.getClientes();
    setClientes(c || []);
  };

  const getProdutos = async () => {
    const p = await API.getProduto({ item: "estoque" });
    setProdutos(p || []);
  };

  const handleAdicionarProduto = (produto) => {
    // Verificar se produto já está na lista
    const produtoExistente = listaVenda.find((item) => item.id === produto.id);

    if (produtoExistente) {
      // Atualizar quantidade
      setListaVenda(
        listaVenda.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + produto.quantidade }
            : item
        )
      );
    } else {
      // Adicionar novo produto
      setListaVenda([...listaVenda, produto]);
    }
  };

  const handleRemoverProduto = (id) => {
    setListaVenda(listaVenda.filter((item) => item.id !== id));
  };

  const handleAlterarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade < 1) return;

    const produto = produtos.find((p) => p.id === id);
    if (novaQuantidade > produto.estoque) {
      alert("Quantidade maior que o estoque disponível!");
      return;
    }

    setListaVenda(
      listaVenda.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const calcularSubtotal = () => {
    return listaVenda.reduce(
      (total, item) => total + item.valor_venda * item.quantidade,
      0
    );
  };

  const calcularTotal = () => {
    return calcularSubtotal() - desconto;
  };

  const handleAdicionarPagamento = (pagamento) => {
    if(pagamento.index !== undefined || pagamento.index !== null){
      const newPagamentos = [...pagamentos];
      const { forma_pagamento, valor_pagamento, parcelas, data_pagamento } = pagamento
      newPagamentos[pagamento.index] = { forma_pagamento, valor_pagamento, parcelas, data_pagamento };
      setPagamentos(newPagamentos);
    }else{
      setPagamentos([...pagamentos, pagamento]);
    }
    setShowModalPagamento(false);
    setPagamento(null);
  };

  const handleRemoverPagamento = (index) => {
    const newPagamentos = [...pagamentos];
    newPagamentos.splice(index, 1);
    setPagamentos(newPagamentos);
  };

  const handleEditarPagamento = (index) => {
    const pagamento = pagamentos[index];
    setPagamento({ ...pagamento, index: index });
    setShowModalPagamento(true);
  };

  const handleFinalizarVenda = async () => {
    if (!cliente) {
      alert("Selecione um cliente!");
      return;
    }

    if (listaVenda.length === 0) {
      alert("Adicione pelo menos um produto!");
      return;
    }

    // Aqui você implementaria a lógica de salvar a venda
    const venda = {
      cliente_id: cliente.id,
      data_venda: new Date().toISOString(),
      forma_pagamento: pagamentos,
      desconto: desconto,
      valor_total: calcularTotal(),
      status: "concluida",
      itens: listaVenda.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_venda,
      })),
    };

    console.log("Venda a ser salva:", venda);

    // await API.putVenda(venda);
    alert("Venda finalizada com sucesso!");
    // navigate("/vendas");
  };
  const sobra = calcularTotal() - pagamentos.map((pagamento) => pagamento.valor_pagamento).reduce((total, valor) => total + valor, 0)
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Nova Venda</h2>
        <span className="text-muted">
          Registre uma nova venda para o cliente
        </span>
      </div>

      <Row className="g-4">
        {/* Coluna Esquerda: Cliente e Produtos */}
        <Col lg={8}>
          {/* Card Cliente */}
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Cliente</h5>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModalCliente(true)}
              >
                <i className="bi bi-person-plus me-2"></i>
                {cliente ? "Alterar Cliente" : "Selecionar Cliente"}
              </Button>
            </Card.Header>
            {cliente && (
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <small className="text-muted">Nome</small>
                      <div className="fw-bold">{cliente.nome}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-2">
                      <small className="text-muted">Telefone</small>
                      <div>{cliente.telefone || "N/A"}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-2">
                      <small className="text-muted">Email</small>
                      <div className="small">{cliente.email || "N/A"}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            )}
            {!cliente && (
              <Card.Body className="text-center py-4 text-muted">
                <i className="bi bi-person fs-1 d-block mb-2 opacity-25"></i>
                Nenhum cliente selecionado
              </Card.Body>
            )}
          </Card>

          {/* Card Produtos */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Produtos ({listaVenda.length})</h5>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModalProduto(true)}
                disabled={!cliente}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Adicionar Produto
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {listaVenda.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">Produto</th>
                        <th className="border-0">Preço Un.</th>
                        <th className="border-0" style={{ width: "150px" }}>
                          Quantidade
                        </th>
                        <th className="border-0">Subtotal</th>
                        <th className="border-0 text-end">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaVenda.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-bold">{item.nome}</div>
                            <small className="text-muted">{item.codigo}</small>
                          </td>
                          <td className="text-success fw-bold">
                            {utils.formatMoney(item.valor_venda)}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() =>
                                  handleAlterarQuantidade(
                                    item.id,
                                    item.quantidade - 1
                                  )
                                }
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                size="sm"
                                value={item.quantidade}
                                onChange={(e) =>
                                  handleAlterarQuantidade(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="text-center"
                                style={{ width: "60px" }}
                              />
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() =>
                                  handleAlterarQuantidade(
                                    item.id,
                                    item.quantidade + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold">
                            {utils.formatMoney(
                              item.valor_venda * item.quantidade
                            )}
                          </td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleRemoverProduto(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-x fs-1 d-block mb-2 opacity-25"></i>
                  {cliente
                    ? "Nenhum produto adicionado"
                    : "Selecione um cliente para adicionar produtos"}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna Direita: Resumo */}
        <Col lg={4}>
          <Card
            className="border-0 shadow-sm sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Resumo da Venda</h5>
            </Card.Header>
            <Card.Body>
              {pagamentos.map((pagamento, index) => (
                <Row key={index} className={index === pagamentos.length - 1 ? "" : "mb-2 border-bottom"}>
                  <Col md={11} className="flex flex-column pe-3">
                    {pagamento.forma_pagamento !== "Dinheiro" && (
                      <Col md={12} className="flex align-items-center justify-content-between">

                        {pagamento.forma_pagamento === "Promissória" ? (
                          <div>
                            <small className="text-muted">Data de Pagamento</small>
                            <div className="fw-bold">{utils.formatDate(pagamento.data_pagamento)}</div>
                          </div>
                        ) : (
                          <div>
                            <small className="text-muted">Código</small>
                            <div className="fw-bold">{pagamento.codigo_pagamento}</div>
                          </div>
                        )}

                        {pagamento.parcelas && (
                          <div className="text-end">
                            <smal className="text-muted">Parcelas</smal>
                            <div className="fw-bold">{pagamento.parcelas}</div>
                          </div>
                        )}
                      </Col>
                    )}
                    <Col md={6} className="flex align-items-center justify-content-between w-100">
                      <div className="mb-2">
                        <small className="text-muted">Forma de Pagamento</small>
                        <div className="fw-bold">{pagamento.forma_pagamento}</div>
                      </div>
                      <div className="mb-2 text-end">
                        <small className="text-muted">Valor</small>
                        <div className="fw-bold">{utils.formatMoney(pagamento.valor_pagamento)}</div>
                      </div>
                    </Col>
                    <Col md={6} className="text-end px-1">
                    </Col>
                  </Col>
                  <Col md={1} className="flex flex-column gap-1 py-2  align-items-end justify-content-center text-center">
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoverPagamento(index)}>
                      <Trash2 size={14} />
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={() => handleEditarPagamento(index)}>
                      <Pencil size={14} />
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                className="w-full mb-2"
                variant="outline-primary"
                onClick={() => setShowModalPagamento(true)}
                disabled={!cliente || listaVenda.length === 0 || calcularTotal() === 0 || sobra <= 0}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar Forma de Pagamento
              </Button>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-bold">
                  {utils.formatMoney(calcularSubtotal())}
                </span>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Desconto</Form.Label>
                <Form.Control
                  type="text"
                  min="0"
                  max={calcularSubtotal()}
                  value={desconto}
                  onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </Form.Group>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Total:</h5>
                <h3 className="mb-0 text-primary">
                  {utils.formatMoney(calcularTotal())}
                </h3>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={handleFinalizarVenda}
                disabled={!cliente || listaVenda.length === 0 || pagamentos.length === 0 || sobra !== 0}
              >
                <i className="bi bi-check-circle me-2"></i>
                Finalizar Venda
              </Button>

              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => navigate("/vendas")}
              >
                Cancelar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      {showModalCliente && (
      <ModalSelecionarCliente
        show={showModalCliente}
        onHide={() => setShowModalCliente(false)}
        clientes={clientes}
        onSelect={setCliente}
      />
      )}

      {showModalProduto && (
        <ModalAdicionarProduto
        show={showModalProduto}
        onHide={() => setShowModalProduto(false)}
        produtos={produtos}
        onAdd={handleAdicionarProduto}
        />
      )}

      {showModalPagamento && (
        <ModalAdicionarPagamento
        show={showModalPagamento}
        onHide={() => setShowModalPagamento(false)}
        valorTotal={sobra}
        onAdd={handleAdicionarPagamento}
        pagamentoEdit={pagamento}
      />
      )}
    </>
  );
}
