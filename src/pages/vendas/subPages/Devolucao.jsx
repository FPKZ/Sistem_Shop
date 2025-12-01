import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import utils from "@app/utils";
import API from "@app/api";

export default function Devolucao() {
  const navigate = useNavigate();

  const [vendaId, setVendaId] = useState("");
  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  const buscarVenda = async () => {
    if (!vendaId) {
      setErro("Digite o ID da venda");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const vendas = await API.getVendas();
      const vendaEncontrada = vendas.find((v) => v.id === parseInt(vendaId));

      if (!vendaEncontrada) {
        setErro("Venda não encontrada");
        setVenda(null);
      } else if (vendaEncontrada.status === "estorno") {
        setErro("Esta venda foi estornada e não pode ter produtos devolvidos");
        setVenda(null);
      } else {
        setVenda(vendaEncontrada);
        setProdutosSelecionados([]);
        setErro("");
      }
    } catch (error) {
      setErro("Erro ao buscar venda");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduto = (item) => {
    const existe = produtosSelecionados.find((p) => p.id === item.id);

    if (existe) {
      setProdutosSelecionados(
        produtosSelecionados.filter((p) => p.id !== item.id)
      );
    } else {
      setProdutosSelecionados([
        ...produtosSelecionados,
        {
          ...item,
          quantidade_devolver: item.quantidade,
        },
      ]);
    }
  };

  const alterarQuantidadeDevolucao = (itemId, novaQuantidade) => {
    const item = venda.itens_venda.find((i) => i.id === itemId);
    if (novaQuantidade < 1 || novaQuantidade > item.quantidade) return;

    setProdutosSelecionados(
      produtosSelecionados.map((p) =>
        p.id === itemId ? { ...p, quantidade_devolver: novaQuantidade } : p
      )
    );
  };

  const calcularValorDevolucao = () => {
    return produtosSelecionados.reduce(
      (total, item) => total + item.valor_unitario * item.quantidade_devolver,
      0
    );
  };

  const confirmarDevolucao = async () => {
    if (produtosSelecionados.length === 0) {
      alert("Selecione pelo menos um produto para devolução");
      return;
    }

    const confirmacao = window.confirm(
      `Confirma a devolução de ${produtosSelecionados.length} produto(s)?\n\n` +
        `Valor a devolver: ${utils.formatMoney(calcularValorDevolucao())}\n\n` +
        `Esta ação não pode ser desfeita.`
    );

    if (!confirmacao) return;

    try {
      // Aqui você implementaria a lógica de devolução
      const devolucao = {
        venda_id: venda.id,
        itens: produtosSelecionados.map((item) => ({
          produto_id: item.produto_id || item.id,
          quantidade: item.quantidade_devolver,
          valor_unitario: item.valor_unitario,
        })),
        valor_total: calcularValorDevolucao(),
      };

      console.log("Devolução:", devolucao);
      // await API.putDevolucao(devolucao);

      alert("Devolução realizada com sucesso!");
      setVenda(null);
      setVendaId("");
      setProdutosSelecionados([]);
      navigate("/vendas");
    } catch (error) {
      alert("Erro ao realizar devolução");
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Devolução de Produtos</h2>
        <span className="text-muted">
          Registre a devolução de produtos de uma venda
        </span>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          {/* Card de Busca */}
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Buscar Venda</h5>
            </Card.Header>
            <Card.Body>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  buscarVenda();
                }}
              >
                <Row className="align-items-end">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>ID da Venda</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Digite o ID da venda"
                        value={vendaId}
                        onChange={(e) => setVendaId(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={buscarVenda}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : "Buscar"}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {erro && (
                <Alert variant="danger" className="mt-3 mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {erro}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Card de Produtos */}
          {venda && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Produtos da Venda #{venda.id}</h5>
                  <div>
                    <small className="text-muted me-3">
                      Cliente: {venda.cliente?.nome}
                    </small>
                    <Badge bg="info">
                      {produtosSelecionados.length} selecionado(s)
                    </Badge>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0" style={{ width: "50px" }}>
                        <Form.Check type="checkbox" disabled />
                      </th>
                      <th className="border-0">Produto</th>
                      <th className="border-0">Qtd Vendida</th>
                      <th className="border-0">Qtd Devolver</th>
                      <th className="border-0">Valor Un.</th>
                      <th className="border-0">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venda.itens_venda &&
                      venda.itens_venda.map((item, index) => {
                        const selecionado = produtosSelecionados.find(
                          (p) => p.id === item.id
                        );
                        return (
                          <tr key={index}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={!!selecionado}
                                onChange={() => toggleProduto(item)}
                              />
                            </td>
                            <td>
                              <div className="fw-bold">
                                {item.produto?.nome || item.nome_produto}
                              </div>
                            </td>
                            <td>{item.quantidade}</td>
                            <td>
                              {selecionado ? (
                                <div
                                  className="d-flex align-items-center gap-1"
                                  style={{ width: "120px" }}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    onClick={() =>
                                      alterarQuantidadeDevolucao(
                                        item.id,
                                        selecionado.quantidade_devolver - 1
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    value={selecionado.quantidade_devolver}
                                    onChange={(e) =>
                                      alterarQuantidadeDevolucao(
                                        item.id,
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="text-center"
                                    style={{ width: "50px" }}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    onClick={() =>
                                      alterarQuantidadeDevolucao(
                                        item.id,
                                        selecionado.quantidade_devolver + 1
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{utils.formatMoney(item.valor_unitario)}</td>
                            <td className="fw-bold">
                              {selecionado ? (
                                utils.formatMoney(
                                  item.valor_unitario *
                                    selecionado.quantidade_devolver
                                )
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Mensagem quando não há venda selecionada */}
          {!venda && !erro && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5 text-muted">
                <i className="bi bi-search fs-1 d-block mb-3 opacity-25"></i>
                <p className="mb-0">Digite o ID da venda para buscar</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Coluna Direita: Resumo */}
        <Col lg={4}>
          {venda && (
            <Card
              className="border-0 shadow-sm sticky-top"
              style={{ top: "20px" }}
            >
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0">Resumo da Devolução</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Produtos selecionados</small>
                  <div className="h4 mb-0">{produtosSelecionados.length}</div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Unidades a devolver</small>
                  <div className="h4 mb-0">
                    {produtosSelecionados.reduce(
                      (total, item) => total + item.quantidade_devolver,
                      0
                    )}
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Valor a Devolver:</h5>
                  <h3 className="mb-0 text-warning">
                    {utils.formatMoney(calcularValorDevolucao())}
                  </h3>
                </div>

                <Button
                  variant="warning"
                  size="lg"
                  className="w-100 mb-2"
                  onClick={confirmarDevolucao}
                  disabled={produtosSelecionados.length === 0}
                >
                  <i className="bi bi-arrow-return-left me-2"></i>
                  Confirmar Devolução
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => navigate("/vendas")}
                >
                  Cancelar
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
}
