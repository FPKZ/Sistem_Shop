import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import utils from "@app/utils";
import API from "@app/api";
import useCurrencyInput from "@hooks/useCurrencyInput";
import ModalSelecionarCliente from "./include/ModalSelecionarCliente";
import ModalAdicionarProduto from "./include/ModalAdicionarProduto";
import ModalAdicionarPagamento from "./include/ModalAdicionarPagamento";
import { Pencil, Trash, Trash2, Trash2Icon, TrashIcon } from "lucide-react";

export default function NovaVenda() {
  const navigate = useNavigate();
  const { mobile } = useOutletContext();

  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [listaVenda, setListaVenda] = useState([]);

  const [reservar, setReservar] = useState(false);

  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);

  const [pagamentos, setPagamentos] = useState([]);
  const [pagamento, setPagamento] = useState(null);
  const [showModalPagamento, setShowModalPagamento] = useState(false);

  useEffect(() => {
    getClientes();
    getProdutos();
  }, [showModalCliente, showModalProduto]);

  useEffect(() => {
    const reservar = async () => {
      await Promise.all(
        listaVenda.map((item) => item.itens.map((i) => reservarProduto(i.id, cliente.id)))
      );
    };

    reservar();
  }, [listaVenda]);

  const getClientes = async () => {
    const c = await API.getClientes();
    setClientes(c || []);
  };

  const getProdutos = async () => {
    const p = await API.getProduto({ item: "estoque" });
    setProdutos(p || []);
  };

  const reservarProduto = async (produto) => {
    await API.reservarProduto(produto, cliente.id);
    getProdutos();
  };

  const handleAdicionarProduto = async (produto) => {
    // Verificar se produto já está na lista
    const produtoExistente = listaVenda.find((item) => item.id === produto.id);

    if (produtoExistente) {
      // Atualizar quantidade
      setListaVenda(
        listaVenda.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + produto.quantidade,
                itens: item.itens.concat(produto.itens),
              }
            : item
        )
      );
    } else {
      // Adicionar novo produto
      setListaVenda([...listaVenda, produto]);
    }
    await getProdutos();
  };

  const handleRemoverProduto = async (id) => {
    const produto = listaVenda.find((item) => item.id === id);
    produto.itens.map(async (item) => {
      await API.removerProduto(item.id, {
        status: "Disponivel",
      });
    });

    await getProdutos();

    setListaVenda(listaVenda.filter((item) => item.id !== id));
  };

  // Função pura para calcular os itens ajustados
  const calcularItensAjustados = (itensAtuais, todosItens, novaQuantidade) => {
    const diferencaQuantidade = novaQuantidade - itensAtuais.length;
    let novosItens = [...itensAtuais];

    if (diferencaQuantidade > 0) {
      // AUMENTOU: Adicionar itens não selecionados
      const idsJaSelecionados = itensAtuais.map((i) => i.id);
      const itensParaAdicionar = [];

      // Encontrar itens que ainda não foram selecionados
      for (const item of todosItens) {
        if (!idsJaSelecionados.includes(item.id)) {
          itensParaAdicionar.push(item);
          if (itensParaAdicionar.length >= diferencaQuantidade) {
            break; // Parar quando atingir a quantidade desejada
          }
        }
      }

      novosItens = [...itensAtuais, ...itensParaAdicionar];
    } else if (diferencaQuantidade < 0) {
      // DIMINUIU: Remover últimos itens
      novosItens = itensAtuais.slice(0, novaQuantidade);
    }

    return novosItens;
  };

  const handleAlterarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade < 1) return;

    const produto = produtos.find((p) => p.id === id);
    const itemVenda = listaVenda.find((item) => item.id === id);

    // Validar se há estoque suficiente
    if (novaQuantidade > produto.itemEstoque.length) {
      alert("Quantidade maior que o estoque disponível!");
      return;
    }

    const novosItens = calcularItensAjustados(
      itemVenda.itens,
      produto.itemEstoque,
      novaQuantidade
    );

    // Atualizar lista de vendas
    setListaVenda(
      listaVenda.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: novaQuantidade,
              itens: novosItens,
            }
          : item
      )
    );
  };

  const calcularSubtotal = () => {
    return listaVenda.reduce(
      (total, item) =>
        total + item.itens.reduce((total, i) => total + i.valor_venda, 0),
      0
    );
  };

  const calcularTotal = () => {
    return calcularSubtotal() - desconto;
  };
  const {
    value: desconto,
    displayValue: displayDesconto,
    onChange: handleDescontoChange,
  } = useCurrencyInput({
    max:
      calcularSubtotal() -
        listaVenda.reduce(
          (total, item) =>
            total + item.itens.reduce((total, i) => total + i.valor_compra, 0),
          0
        ) || 0,
  });

  const handleAdicionarPagamento = (pagamento) => {
    if (pagamento.index !== undefined && pagamento.index !== null) {
      const newPagamentos = [...pagamentos];
      // console.log("Pagamentos edit", newPagamentos)
      const { forma_pagamento, valor_pagamento, parcelas, data_pagamento } =
        pagamento;
      newPagamentos[pagamento.index] = {
        forma_pagamento,
        valor_pagamento,
        parcelas,
        data_pagamento,
      };
      setPagamentos(newPagamentos);
    } else {
      console.log("Pagamentos add", pagamentos);
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

    const itens = [];

    listaVenda.map((item) =>
      item.itens.map((i) =>
        itens.push({
          itemEstoque_id: i.id,
          valor_unitario: i.valor_venda,
        })
      )
    );

    const currentDate = new Date().toISOString();
    const currentTotal = calcularTotal();

    // Aqui você implementaria a lógica de salvar a venda
    const venda = {
      cliente_id: cliente.id,
      data_venda: currentDate,
      notaVenda: pagamentos,
      desconto: desconto,
      valor_total: currentTotal,
      status: "concluida",
      itensVendidos: itens,
    };

    console.log("Venda a ser salva:", venda);

    const response = await API.postVenda(venda);
    console.log(response)
    if (response.ok) {
      alert("Venda finalizada com sucesso!");
      // navigate("/vendas");
    } else {
      alert("Erro ao finalizar venda!");
    }
  };

  const sobra =
    calcularTotal() -
    pagamentos
      .map((pagamento) => pagamento.valor_pagamento)
      .reduce((total, valor) => total + valor, 0);

  const handleCancelarVenda = async () => {
    
    await listaVenda.map( async (item) => await handleRemoverProduto(item.id))
    
    navigate("/vendas");
  };
  
  console.log(listaVenda);
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Nova Venda</h2>
        <span className="text-muted">
          Registre uma nova venda para o cliente
        </span>
      </div>

      <Row className="g-4">
        <Col xs={12} className="d-flex align-items-center justify-content-end gap-2 m-0 mt-2 mt-mb-0 mb-2 pe-4">
          <Form.Check
            type="switch"
            id="custom-switch-page"
            label="Reservar Produtos"
            checked={reservar}
            onChange={(e) => setReservar(e.target.checked)}
            className="m-0 small"
          />
        </Col>
        {/* Coluna Esquerda: Cliente e Produtos */}
        <Col lg={8} className="m-0">
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
                <div className="d-flex flex-column">
                  {/* Header - Visível apenas em desktop */}
                  <Row className="py-2 m-0 d-none d-md-flex border-bottom">
                    <Col md={4} className="fw-semibold">
                      Produto
                    </Col>
                    <Col md={2} className="fw-semibold">
                      Preço Un.
                    </Col>
                    <Col md={3} className="fw-semibold text-center">
                      Quantidade
                    </Col>
                    <Col md={2} className="fw-semibold">
                      Subtotal
                    </Col>
                    <Col md={1} className="fw-semibold text-center m-0 p-0">
                      Ação
                    </Col>
                  </Row>

                  {/* Lista de produtos */}
                  {listaVenda.map((item, index) => (
                    <div
                      key={item.id}
                      className={`border-top ${
                        index % 2 === 0 ? "bg-white" : "bg-light bg-opacity-25"
                      }`}
                    >
                      <Row className="py-2 px-1 m-0 align-items-center">
                        {/* Produto */}
                        <Col
                          xs={10}
                          md={4}
                          className="mb-2 mb-md-0 order-first"
                        >
                          <div className="d-flex flex-column">
                            <span className="d-none text-muted small mb-1">
                              Produto
                            </span>
                            <div className="fw-bold">{item.nome}</div>
                            <small className="text-muted">{item.codigo}</small>
                          </div>
                        </Col>

                        {/* Preço Unitário */}
                        <Col xs={3} md={2} className="mb-0 order-3 order-md-2">
                          <div className="d-flex flex-column">
                            <span className="d-md-none text-muted small mb-1">
                              Preço Un.
                            </span>
                            <span className="text-success fw-bold">
                              {utils.formatMoney(
                                Math.max(
                                  ...item.itens.map((i) => i.valor_venda),
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </Col>

                        {/* Quantidade */}
                        <Col
                          xs={3}
                          md={3}
                          className="mb-2 mb-md-0 order-2 order-md-3"
                        >
                          <div className="d-flex flex-column align-items-md-center w-100">
                            <span className="d-md-none text-muted small mb-1">
                              Quantidade
                            </span>
                            <div
                              className={`d-flex align-items-center gap-1 ${
                                mobile ? "w-100" : "w-50"
                              }`}
                            >
                              <Dropdown className="w-100">
                                <Dropdown.Toggle
                                  variant="outline-secondary"
                                  size="sm"
                                  className="w-100"
                                >
                                  {item.quantidade}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu">
                                  {Array.from(
                                    {
                                      length: produtos.find(
                                        (i) => i.id === item.id
                                      ).itemEstoque.length || 0,
                                    },
                                    (_, i) => i + 1
                                  ).map((quantidade) => (
                                    <Dropdown.Item
                                      className="text-center"
                                      key={quantidade}
                                      onClick={() =>
                                        handleAlterarQuantidade(
                                          item.id,
                                          quantidade
                                        )
                                      }
                                    >
                                      {quantidade}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </Col>

                        {/* Subtotal */}
                        <Col
                          xs={6}
                          md={2}
                          className="m-0 text-end text-md-start order-4 order-md-4"
                        >
                          <div className="d-flex flex-column">
                            <span className="d-md-none text-muted small mb-1">
                              Subtotal
                            </span>
                            <span className="fw-bold">
                              {utils.formatMoney(
                                item.itens.reduce(
                                  (total, i) => total + i.valor_venda,
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </Col>

                        {/* Ação */}
                        <Col
                          xs={2}
                          md={1}
                          className="flex justify-content-end justify-content-md-center order-1 order-md-last"
                        >
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleRemoverProduto(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
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
        <Col lg={4} className="m-0">
          <Card
            className="border-0 shadow-sm sticky-top"
            style={{ top: "20px" }}
          >
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Resumo da Venda</h5>
            </Card.Header>
            <Card.Body>
              {pagamentos.map((pagamento, index) => (
                <Row
                  key={index}
                  className={
                    index === pagamentos.length - 1 ? "" : "mb-2 border-bottom"
                  }
                >
                  <Col md={11} className="flex flex-column pe-4">
                    {pagamento.forma_pagamento !== "Dinheiro" && (
                      <Col
                        md={12}
                        className="flex align-items-center justify-content-between"
                      >
                        {pagamento.forma_pagamento === "Promissória" ? (
                          <div>
                            <small className="text-muted">
                              Data de Pagamento
                            </small>
                            <div className="fw-bold">
                              {utils.formatDate(pagamento.data_pagamento)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <small className="text-muted">Código</small>
                            <div className="fw-bold">
                              {pagamento.codigo_pagamento}
                            </div>
                          </div>
                        )}

                        {pagamento.parcelas && (
                          <div className="text-end">
                            <small className="text-muted">Parcelas</small>
                            <div className="fw-bold">{pagamento.parcelas}</div>
                          </div>
                        )}
                      </Col>
                    )}
                    <Col
                      md={6}
                      className="flex align-items-center justify-content-between w-100"
                    >
                      <div className="mb-2">
                        <small className="text-muted">Forma de Pagamento</small>
                        <div className="fw-bold">
                          {pagamento.forma_pagamento}
                        </div>
                      </div>
                      <div className="mb-2 text-end">
                        <small className="text-muted">Valor</small>
                        <div className="fw-bold">
                          {utils.formatMoney(pagamento.valor_pagamento)}
                        </div>
                      </div>
                    </Col>
                    <Col md={6} className="text-end px-1"></Col>
                  </Col>
                  <Col
                    md={1}
                    className="flex flex-column gap-1 py-2  align-items-end justify-content-center text-center"
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoverPagamento(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleEditarPagamento(index)}
                    >
                      <Pencil size={14} />
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                className="w-full mb-2"
                variant="outline-primary"
                onClick={() => setShowModalPagamento(true)}
                disabled={
                  !cliente ||
                  listaVenda.length === 0 ||
                  calcularTotal() === 0 ||
                  sobra <= 0
                }
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
                  value={displayDesconto}
                  onChange={handleDescontoChange}
                  placeholder="R$ 0,00"
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
                disabled={
                  !cliente ||
                  listaVenda.length === 0 ||
                  pagamentos.length === 0 ||
                  sobra !== 0
                }
              >
                <i className="bi bi-check-circle me-2"></i>
                Finalizar Venda
              </Button>

              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => handleCancelarVenda()}
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
          calcularItensAjustados={calcularItensAjustados}
        />
      )}

      {showModalPagamento && (
        <ModalAdicionarPagamento
          show={showModalPagamento}
          onHide={() => setShowModalPagamento(false)}
          valorTotal={sobra}
          total={calcularTotal()}
          onAdd={handleAdicionarPagamento}
          pagamentoEdit={pagamento}
        />
      )}
    </>
  );
}
