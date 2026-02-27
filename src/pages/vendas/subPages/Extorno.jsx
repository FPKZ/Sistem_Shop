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

export default function Estorno() {
  const navigate = useNavigate();

  const [vendaId, setVendaId] = useState("");
  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

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
        setErro("Esta venda já foi estornada");
        setVenda(null);
      } else {
        setVenda(vendaEncontrada);
        setErro("");
      }
    } catch (error) {
      setErro("Erro ao buscar venda");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEstorno = async () => {
    if (!venda) return;

    const confirmacao = window.confirm(
      `Confirma o estorno da venda #${venda.id}?\n\n` +
        `Cliente: ${venda.cliente?.nome}\n` +
        `Valor: ${utils.formatMoney(venda.valor_total)}\n\n` +
        `Esta ação não pode ser desfeita.`
    );

    if (!confirmacao) return;

    try {
      const response = await API.putEstorno(venda.id);

      if (response && response.ok) {
        alert("Estorno realizado com sucesso!");
        setVenda(null);
        setVendaId("");
        navigate("/vendas");
      } else {
        alert(response?.error || "Erro ao realizar estorno");
      }

    } catch (error) {
      alert("Erro ao realizar estorno");
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Estorno de Venda</h2>
        <span className="text-muted">Cancele uma venda realizada</span>
      </div>

      <Row className="g-4">
        <Col lg={8} className="mx-auto">
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

          {/* Card de Detalhes da Venda */}
          {venda && (
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Detalhes da Venda #{venda.id}</h5>
                  <Badge
                    bg={venda.status === "concluida" ? "success" : "warning"}
                  >
                    {utils.capitalize(venda.status)}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                {/* Informações do Cliente */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Cliente</h6>
                  <Row>
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">Nome</small>
                        <div className="fw-bold">{venda.cliente?.nome}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <small className="text-muted">Data</small>
                        <div>{utils.formatDate(venda.data_venda)}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <small className="text-muted">Telefone</small>
                        <div>{venda.cliente?.telefone || "N/A"}</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Produtos */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Produtos</h6>
                  <Table hover size="sm" className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Valor Un.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venda.itens_venda &&
                        venda.itens_venda.map((item, index) => (
                          <tr key={index}>
                            <td>{item.produto?.nome || item.nome_produto}</td>
                            <td>{item.quantidade}</td>
                            <td>{utils.formatMoney(item.valor_unitario)}</td>
                            <td className="fw-bold">
                              {utils.formatMoney(
                                item.quantidade * item.valor_unitario
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>

                {/* Resumo Financeiro */}
                <div className="bg-light rounded p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Valor Total:</h5>
                    <h3 className="mb-0 text-danger">
                      {utils.formatMoney(venda.valor_total)}
                    </h3>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    className="grow"
                    onClick={confirmarEstorno}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Confirmar Estorno
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setVenda(null);
                      setVendaId("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card.Footer>
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
      </Row>
    </>
  );
}
