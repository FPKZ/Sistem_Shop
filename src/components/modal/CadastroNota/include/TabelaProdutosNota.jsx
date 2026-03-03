import { Container, Card, Col, Row, Badge, Button } from "react-bootstrap";
import utils from "@app/utils";
import img from "@assets/logo.svg?url";
import { X } from "lucide-react";

export default function TabelaProdutosNota({
  produto,
  setItemEstoque,
  width,
  custom,
  setmodalInfoProduto,
  removerProduto,
}) {
  return (
    <Col
      md={width}
      className={`order-md-1 order-2 m-0 p-0 d-flex flex-column border rounded-0 ${custom}`}
    >
      {/* Cabeçalho Fixo */}
      <Row
        className="g-0 p-2 m-0 border-bottom position-sticky top-0 bg-light fw-bold text-secondary"
        style={{ zIndex: 1, fontSize: "0.9rem" }}
      >
        <Col xs={1} sm={1} className="text-center">
          Img
        </Col>
        <Col xs={4} sm={4}>
          Nome
        </Col>
        <Col xs={3} sm={2} className="text-end">
          Valor
        </Col>
        <Col xs={2} sm={2} className="text-center">
          Status
        </Col>
        <Col xs={1} sm={2} className="text-end pe-2">
          Lucro
        </Col>
        <Col xs={1} sm={1} className="text-center">
          {/* Ações */}
        </Col>
      </Row>

      {/* Container dos Cards com Rolagem */}
      <div
        className="grow p-0 overflow-hidden h-100"
        style={{ overflowY: "auto" }}
      >
        {produto.map((prod, index) => (
          <Produtos
            key={index}
            produtos={prod}
            setItemEstoque={setItemEstoque}
            setmodalInfoProduto={setmodalInfoProduto}
            removerProduto={removerProduto}
          />
        ))}
      </div>
    </Col>
  );
}

function Produtos({
  produtos,
  setItemEstoque,
  setmodalInfoProduto,
  removerProduto,
}) {
  if (!produtos) return null;

  // O objeto produto pode vir direto ou dentro de 'itens' dependendo de como foi estruturado anteriormente.
  // No CadastroNotaModalNew, estamos concatenando o objeto completo que tem 'itens' dentro.
  // Mas a tabela original parecia iterar sobre 'produto' que era um array.
  // Vamos assumir que 'produtos' aqui é um item da lista 'produtos' do modal.
  // Esse item tem a estrutura do formValue do modal de produto + array 'itens'.

  // Para exibição simplificada na tabela da nota, vamos pegar os dados principais.
  // Se houver múltiplos itens no array 'itens' (o que não deve acontecer no novo modelo de 1 item por objeto na lista principal,
  // exceto se o backend retornar agrupado, mas aqui é frontend state), pegamos o primeiro.

  const itemDetalhe =
    produtos.itens && produtos.itens[0] ? produtos.itens[0] : {};

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponivel":
        return <Badge bg="success">Disponível</Badge>;
      case "Reservado":
        return <Badge bg="warning">Reservado</Badge>;
      case "Vendido":
        return <Badge bg="danger">Vendido</Badge>;
      default:
        return <Badge bg="secondary">{status || "Pendente"}</Badge>;
    }
  };

  return (
    <Card
      className="border-0 border-bottom rounded-0 p-0 m-0 hover-bg-light"
      onClick={() => {
        setItemEstoque?.(produtos);
        setmodalInfoProduto?.(true);
      }}
      style={{ cursor: "pointer", transition: "background-color 0.2s" }}
    >
      <Card.Body className="p-2">
        <Row className="align-items-center g-0">
          {/* Imagem */}
          <Col xs={2} sm={1} className="text-center">
            <div
              className="rounded border d-flex align-items-center justify-content-center mx-auto"
              style={{ width: "40px", height: "40px", overflow: "hidden" }}
            >
              <img
                src={
                  produtos.img
                    ? typeof produtos.img === "string"
                      ? produtos.img
                      : URL.createObjectURL(produtos.img)
                    : img
                }
                onError={(e) => {
                  e.target.onerror = null; // Previne loop infinito
                  e.target.src = img;
                }}
                alt={produtos.nome}
                className="img-fluid"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </Col>

          {/* Nome e Detalhes */}
          <Col xs={4} sm={4} className="px-2">
            <div className="fw-medium text-truncate" title={produtos.nome}>
              {produtos.nome}
            </div>
            <div className="text-muted small text-truncate">
              {itemDetalhe.marca} - {/*{itemDetalhe.cor} -*/}{" "}
              {itemDetalhe.tamanho}
            </div>
          </Col>

          {/* Valor */}
          <Col xs={3} sm={2} className="text-end">
            <div className="fw-bold text-dark">
              {utils.formatMoney(itemDetalhe.valor_venda || 0)}
            </div>
            <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
              Comp: {utils.formatMoney(itemDetalhe.valor_compra || 0)}
            </div>
          </Col>

          {/* Status */}
          <Col xs={3} sm={2} className="text-center">
            {getStatusBadge(itemDetalhe.status || "Disponivel")}
          </Col>

          {/* Lucro (Desktop) */}
          <Col xs={1} sm={2} className="text-end ps-2 pe-2">
            <span className="text-success fw-medium">
              +{utils.formatMoney(itemDetalhe.lucro || 0)}
            </span>
          </Col>

          {/* Botão Remover */}
          <Col xs={1} sm={1} className="text-center">
            <Button
              variant="link"
              className="p-0 text-danger shadow-none"
              onClick={(e) => {
                e.stopPropagation();
                removerProduto?.(produtos.frontId);
              }}
            >
              <X size={18} />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
