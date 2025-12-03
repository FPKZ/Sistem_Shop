import {
  Modal,
  Button,
  Form,
  Table,
  Badge,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { Hash, Icon } from "lucide-react";
import { useState, useEffect } from "react";
import utils from "@app/utils";
import API from "@app/api";

export default function ModalAdicionarProduto({
  show,
  onHide,
  produtos,
  onAdd,
  calcularItensAjustados,
}) {
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo?.includes(busca)
  );

  useEffect(() => {
    if (produtoSelecionado) {
      if (itensSelecionados.length === 0) {
        const iten = produtoSelecionado.itemEstoque[0];
        setItensSelecionados([...itensSelecionados, iten]);
      }
      if (quantidade !== itensSelecionados.length) {
        setQuantidade(itensSelecionados.length);
      }
    }
  }, [produtoSelecionado, itensSelecionados]);

  const handleQuantidade = (qtd) => {
    // 1. Calcular a nova quantidade
    const novaQuantidade = quantidade + qtd;

    // 2. Validar limites
    if (
      novaQuantidade < 1 ||
      novaQuantidade > produtoSelecionado.itemEstoque.length
    ) {
      return; // Não faz nada se estiver fora dos limites
    }

    // 3. Atualizar a quantidade
    setQuantidade(novaQuantidade);

    // 4. Ajustar itensSelecionados usando a função recebida via prop
    if (calcularItensAjustados) {
      const novosItens = calcularItensAjustados(
        itensSelecionados,
        produtoSelecionado.itemEstoque,
        novaQuantidade
      );
      setItensSelecionados(novosItens);
    }
  };
  const handleQuantidadeInput = (valorDigitado) => {
    const novaQuantidade = Math.max(
      1,
      Math.min(valorDigitado, produtoSelecionado.itemEstoque.length)
    );
    const diferenca = novaQuantidade - quantidade;

    if (diferenca !== 0) {
      handleQuantidade(diferenca);
    }
  };

  const handleAdd = async () => {
    if (!produtoSelecionado) return;

    if (quantidade > produtoSelecionado.itemEstoque.length) {
      alert("Quantidade maior que o estoque disponível!");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { id, nome, categoria, img, descricao, itemEstoque } =
      produtoSelecionado;
    onAdd({
      id,
      nome,
      categoria,
      img,
      descricao,

      itens: itensSelecionados,
      quantidade: parseInt(quantidade),
    });

    // Reset
    setProdutoSelecionado(null);
    setItensSelecionados([]);
    setQuantidade(1);
    setBusca("");
    onHide();
  };

  const handleSelectProduto = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade(1);
  };

  const handleSelectProdutoItem = (item, isChecked) => {
    console.log(item, isChecked);

    if (isChecked) {
      // Adiciona o item à lista de selecionados
      setItensSelecionados([...itensSelecionados, item]);
    } else {
      // Remove o item da lista de selecionados
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
    }
  };

  // console.log(itensSelecionados);
  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down" centered>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Produto</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column overflow-hidden">
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
                          {utils.formatMoney(
                            Math.max(
                              ...produto.itemEstoque.map(
                                (item) => item.valor_venda
                              )
                            )
                          )}
                        </td>
                        <td>
                          <Badge
                            bg={
                              produto.itemEstoque.length > 10
                                ? "success"
                                : produto.itemEstoque.length > 0
                                ? "warning"
                                : "danger"
                            }
                          >
                            {produto.itemEstoque.length} un.
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={produto.itemEstoque.length === 0}
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
          <div className="d-flex flex-column h-100">
            {/* Informações do produto - fixo */}
            <div className="border rounded p-3 mb-3 bg-light shrink-0">
              <h5 className="mb-2">{produtoSelecionado.nome}</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Preço unitário:</span>
                <span className="fw-bold text-success">
                  {utils.formatMoney(
                    Math.max(
                      ...produtoSelecionado.itemEstoque.map(
                        (item) => item.valor_venda
                      )
                    )
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Estoque disponível:</span>
                <Badge
                  bg={
                    produtoSelecionado.itemEstoque.length > 10
                      ? "success"
                      : "warning"
                  }
                >
                  {produtoSelecionado.itemEstoque.length} un.
                </Badge>
              </div>
            </div>

            {/* Seletor de quantidade - fixo */}
            <Form.Group className="shrink-0">
              <Form.Label>Quantidade</Form.Label>
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantidade(-1)}
                >
                  -
                </Button>
                <Form.Control
                  type="number"
                  min="1"
                  max={produtoSelecionado.itemEstoque.length}
                  value={quantidade}
                  onChange={(e) =>
                    handleQuantidadeInput(parseInt(e.target.value) || 1)
                  }
                  className="text-center"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantidade(1)}
                >
                  +
                </Button>
              </InputGroup>

              {/* Container da lista de itens - cresce para preencher espaço */}
              <div
                className="d-flex flex-column grow overflow-hidden mt-3 border rounded"
                style={{ minHeight: 0 }}
              >
                {/* Lista de itens com scroll */}
                <div
                  className="grow overflow-y-auto p-2"
                  style={{ maxHeight: "400px" }}
                >
                  <div className="d-flex flex-column gap-2">
                    {produtoSelecionado.itemEstoque.map((item) => (
                      <div key={item.id} className="border rounded">
                        <Row
                          key={item.id}
                          className="cursor-pointer items-center py-2 p-md-2 m-0"
                          onClick={() => {
                            const isCurrentlySelected = itensSelecionados.some(
                              (i) => i.id === item.id
                            );
                            handleSelectProdutoItem(item, !isCurrentlySelected);
                          }}
                        >
                          <Col
                            xs={2}
                            md={1}
                            className="flex justify-content-end justify-content-md-start order-1 order-md-0"
                          >
                            <div className="d-flex align-items-center justify-content-center bg-gray-200 p-2 w-fit rounded">
                              <Hash size={12} color={"#000"} />
                              <span className="m-0 fs-6 fw-bold">
                                {item.id}
                              </span>
                            </div>
                          </Col>
                          <Col
                            xs={10}
                            md={5}
                            className="order-first order-md-0"
                          >
                            <div className="d-flex">
                              <div className="text-muted me-2">Nome:</div>
                              <div className="fw-bold">{item.nome}</div>
                            </div>
                            <div className="d-flex">
                              <div className="text-muted me-2">
                                Código de barras:
                              </div>
                              <small className="text-muted">
                                {item.codigo_barras}
                              </small>
                            </div>
                          </Col>
                          <Col xs={8} md={2} className="order-2 order-md-0">
                            <div className="d-flex">
                              <div className="text-muted me-2">Marca: </div>
                              <div>{item.marca}</div>
                            </div>
                            <div className="d-flex">
                              <div className="text-muted me-2">Tamanho: </div>
                              <div>{item.tamanho}</div>
                            </div>
                          </Col>
                          <Col
                            xs={4}
                            md={3}
                            className="fw-bold text-success text-end fs-5 h-100 justify-content-center align-items-center order-3 order-md-0"
                          >
                            {utils.formatMoney(item.valor_venda)}
                          </Col>
                          <Col
                            md={1}
                            className="text-end order-4 order-md-0 d-md-block d-none"
                          >
                            <Form.Check
                              type="checkbox"
                              checked={itensSelecionados.some(
                                (i) => i.id === item.id
                              )}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectProdutoItem(item, e.target.checked);
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Form.Text className="text-muted mt-2">
                Máximo: {produtoSelecionado.itemEstoque.length} unidades
              </Form.Text>
            </Form.Group>

            {/* Subtotal - fixo */}
            <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded flex-shrink-0">
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
