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
import utils from "@services/utils";
import API from "@services";

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
          nome_produto: item.itemEstoque?.nome
        },
      ]);
    }
  };

  const alterarQuantidadeDevolucao = (itemId, novaQuantidade) => {
    const item = venda.itensVendidos.find((i) => i.id === itemId);
    // Observe que no estoque cada itemVendido é uma unidade (quantidade = 1 fisicamente).
    // Se no frontend os itens foram agrupados, a quantidade_devolver máxima precisa ser ajustada pela agregação real.
    // Como os itens estão vindos do banco de 1 em 1 no model ItemEstoque, nós temos que garantir que a interface agrupe ou use a quantidade=1 per row.

    if (novaQuantidade < 1) return;

    setProdutosSelecionados(
      produtosSelecionados.map((p) =>
        p.id === itemId ? { ...p, quantidade_devolver: novaQuantidade } : p
      )
    );
  };

  const calcularValorDevolucao = () => {
    return produtosSelecionados.reduce(
      (total, item) => total + Number(item.itemEstoque?.valor_venda || 0),
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
      // Cria a lista dos ids específicos de itemEstoqueBaseados na qtdSelecionada
      const itensDevolverIds = [];

      produtosSelecionados.forEach((prodSelecionado) => {
        // Encontrar o grupo do carrinho dentro da venda atual para pegar os itemEstoque que pertencem a esse produto_id
        const itemVendaReal = venda.itensVendidos.find(
          (iv) => iv.itemEstoque?.produto_id === prodSelecionado.produto_id 
          || iv.itemEstoque?.nome === prodSelecionado.nome_produto
        );
        
        // Pega quantos o user quer devolver e joga o ID correspondente à baixa
        if(prodSelecionado.itens){
           const itensFisicos = prodSelecionado.itens.slice(0, prodSelecionado.quantidade_devolver);
           itensFisicos.forEach(i => itensDevolverIds.push(i.itemEstoque_id));
        } else {
            // Em fallback onde o Array de itens separados não está tão visual
            // A gente busca na própria Venda os itens daquele nome/produto que podem ser devolvidos
            const itensDoProdutoNaVenda = venda.itensVendidos.filter(iv => iv.itemEstoque?.nome === prodSelecionado.nome_produto);
            const itensReduzir = itensDoProdutoNaVenda.slice(0, prodSelecionado.quantidade_devolver);
            itensReduzir.forEach(i => itensDevolverIds.push(i.itemEstoque_id));
        }
      });

      const devolucaoPayload = {
        itensDevolverIds,
        valorDevolvido: calcularValorDevolucao(),
      };

      console.log("Devolução:", devolucaoPayload);
      const response = await API.putDevolucao(venda.id, devolucaoPayload);

      if (response && response.ok) {
        alert("Devolução realizada com sucesso!");
        setVenda(null);
        setVendaId("");
        setProdutosSelecionados([]);
        navigate("/vendas");
      } else {
        alert(response?.error || "Erro ao realizar devolução");
      }

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
                      <th className="border-0">ID Item</th>
                      <th className="border-0">Produto</th>
                      <th className="border-0 text-end">Valor do Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venda.itensVendidos &&
                      venda.itensVendidos.map((item, index) => {
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
                            <td>#{item.id}</td>
                            <td>
                              <div className="fw-bold">
                                {item.itemEstoque?.nome}
                              </div>
                            </td>
                            <td className="text-end">{utils.formatMoney(item.itemEstoque?.valor_venda)}</td>
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
                  <small className="text-muted">Itens a devolver</small>
                  <div className="h4 mb-0">
                    {produtosSelecionados.length}
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
