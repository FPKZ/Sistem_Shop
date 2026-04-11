import { useState, useEffect, useRef } from "react";
import util from "@app/utils.js";
import {
  Modal,
  Row,
  Col,
  Button,
  Card,
  Container,
  Badge,
  Tabs,
  Tab,
  Carousel,
} from "react-bootstrap";
import TabelaProdutos from "@tabelas/TabelaProduto.jsx";
import {
  Tag,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  DollarSign,
  Barcode,
  ShoppingBag,
  Info as InfoIcon,
  Archive,
} from "lucide-react";

export default function ProdutoInfo({
  visible,
  onClose,
  produto,
  deletarProduto,
  mobile,
  tableShow = true,
}) {
  const [itemEstoque, setItemEstoque] = useState({});
  const detailsRef = useRef(null);

  useEffect(() => {
    if (visible && !tableShow && produto) {
      // Se o produto vier do fluxo de nota (objeto com array 'itens'), 
      // normalizamos para que as propriedades do primeiro item sejam acessíveis no nível raiz
      if (produto.itens && Array.isArray(produto.itens) && produto.itens.length > 0) {
        const itemPrincipal = produto.itens[0];
        setItemEstoque({
          ...itemPrincipal,
          imgs: produto.imgs, // Preserva as imagens do objeto pai
          nome: produto.nome, // Preserva o nome do objeto pai
          descricao: produto.descricao, // Preserva a descrição
          ...produto // Sobrescreve com o resto para redundância
        });
      } else {
        setItemEstoque(produto);
      }
    }
  }, [visible, tableShow, produto]);

  useEffect(() => {
    if (visible && tableShow) setItemEstoque({});
  }, [visible, produto, tableShow]);

  useEffect(() => {
    if (visible && detailsRef.current) {
      detailsRef.current.scrollTop = 0;
    }
  }, [visible, itemEstoque]);

  if (!visible) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponivel":
        return (
          <Badge
            bg="success-subtle"
            className="text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          >
            <CheckCircle2 size={14} /> Disponível
          </Badge>
        );
      case "Reservado":
        return (
          <Badge
            bg="warning-subtle"
            className="text-warning border border-warning-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          >
            <Clock size={14} /> Reservado
          </Badge>
        );
      case "Vendido":
        return (
          <Badge
            bg="danger-subtle"
            className="text-danger border border-danger-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          >
            <ShoppingBag size={14} /> Vendido
          </Badge>
        );
      default:
        return (
          <Badge
            bg="secondary-subtle"
            className="text-secondary border border-secondary-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-2"
          >
            <AlertCircle size={14} /> {status || "Pendente"}
          </Badge>
        );
    }
  };

  const InfoBlock = ({
    label,
    value,
    icon: Icon,
    color = "text-secondary",
    colIdx = 6,
    xs = 5,
  }) => (
    <Col md={colIdx} xs={xs} className="mb-2">
      <div className="p-2 px-3 rounded-4 bg-light border border-opacity-10 h-100 transition-hover shadow-sm">
        <div className="d-flex align-items-center gap-2 mb-1">
          {Icon && <Icon size={12} className="text-roxo" />}
          <span
            className="text-muted fw-bold text-uppercase"
            style={{ fontSize: "0.6rem", letterSpacing: "0.03rem" }}
          >
            {label}
          </span>
        </div>
        <div className={`fw-semibold ${color} text-truncate small`}>
          {value || "---"}
        </div>
      </div>
    </Col>
  );

  return (
    <Modal
      show={visible}
      onHide={onClose}
      size="xl"
      fullscreen="lg-down"
      dialogClassName="modal-xl"
      animation={true}
      centered
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-roxo h5">
          Detalhes do Produto
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          height: mobile ? "auto" : "75dvh",
          minHeight: mobile ? "auto" : "550px",
          padding: 0,
        }}
        className={`${mobile ? "overflow-auto" : "overflow-hidden"} bg-white`}
      >
        <Row className="h-100 g-0">
          {/* Tabela lateral opcional */}
          {tableShow && (
            <TabelaProdutos
              mobile={mobile}
              produto={produto}
              setItemEstoque={setItemEstoque}
              width={mobile ? 12 : 5}
              custom={`border-end ${mobile ? "border-bottom" : ""}`}
            />
          )}

          {/* Área de Detalhes Principal */}
          <Col
            lg={tableShow ? 7 : 12}
            xl={tableShow ? 7 : 12}
            className={`order-2 ${mobile ? "" : "h-100 overflow-y-auto custom-scrollbar"} p-3 p-md-4`}
          >
            {(!itemEstoque.id && !itemEstoque._id) ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5">
                <div className="bg-roxo-subtle p-4 rounded-circle mb-3">
                  <Package size={48} className="text-roxo" />
                </div>
                <h4 className="fw-bold">Nenhum item selecionado</h4>
                <p className="text-muted">
                  Selecione um item da lista lateral para visualizar as
                  especificações, valores e status atualizado.
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* Cabeçalho do Produto */}
                <div className="d-flex flex-column flex-md-row gap-3 mb-2 pb-2 border-bottom align-items-start align-items-md-center">
                  <div
                    className="bg-light rounded-4 border p-2 shadow-sm"
                    style={{
                      width: "140px",
                      height: "140px",
                      minWidth: "140px",
                    }}
                  >
                    <img
                      className="w-100 h-100 rounded-3 object-fit-cover"
                      src={
                        itemEstoque.imgs && itemEstoque.imgs.length > 0
                          ? itemEstoque.imgs[0]
                          : "assets/tube-spinner.svg"
                      }
                      alt={produto.nome}
                    />
                  </div>
                  <div className="grow">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      {getStatusBadge(itemEstoque.status)}
                      <Badge
                        bg="roxo-subtle"
                        className="text-roxo px-3 py-2 rounded-pill d-flex align-items-center gap-1"
                      >
                        <Tag size={14} />
                        <span>
                          {produto.categoria?.nome || "Sem Categoria"}
                        </span>
                      </Badge>
                    </div>
                    <h3 className="fw-bold mb-0">{produto.nome}</h3>
                    <p className="text-muted small mb-2">
                      {produto.descricao || "Sem descrição disponível."}
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="roxo"
                        className="d-flex align-items-center gap-2 px-4 shadow-sm"
                      >
                        <Edit size={18} /> Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="d-flex align-items-center gap-2 px-4"
                        onClick={() => deletarProduto(itemEstoque.id)}
                      >
                        <Trash2 size={18} /> Excluir
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Grid de Informações */}
                <Row className="g-3">
                  <Col xl={8} lg={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body className="p-3">
                        <Tabs
                          defaultActiveKey="tecnico"
                          id="produto-detalhes-tabs"
                          className="mb-3 custom-tabs"
                        >
                          <Tab
                            eventKey="tecnico"
                            title={
                              <span className="d-flex align-items-center gap-2">
                                <InfoIcon size={18} /> Info. Técnica
                              </span>
                            }
                          >
                            <Row className="g-3 animate-fade-in">
                              <InfoBlock
                                label="Marca"
                                value={itemEstoque.marca}
                                icon={Package}
                                colIdx={6}
                              />
                              <InfoBlock
                                label="Tamanho"
                                value={itemEstoque.tamanho}
                                icon={Layers}
                                colIdx={4}
                              />
                              <Col md={2} xs={2} className="mb-2">
                                <div className="p-3 rounded-4 bg-light border border-opacity-10 h-100 shadow-sm d-flex flex-column align-items-center">
                                  <span
                                    className="text-muted small fw-bold text-uppercase mb-2"
                                    style={{ fontSize: "0.6rem" }}
                                  >
                                    COR
                                  </span>
                                  <div
                                    className="rounded-circle border shadow-sm"
                                    style={{
                                      width: "1.5rem",
                                      height: "1.5rem",
                                      backgroundColor:
                                        itemEstoque.cor || "#000",
                                    }}
                                  />
                                </div>
                              </Col>
                              <InfoBlock
                                label="Código de Barras"
                                value={itemEstoque.codigo_barras}
                                icon={Barcode}
                                colIdx={12}
                                xs={12}
                              />
                              <InfoBlock
                                label="Origem (Nota)"
                                value={
                                  itemEstoque.nota
                                    ? `#${itemEstoque.nota.codigo}`
                                    : "Nenhuma nota associada"
                                }
                                icon={Archive}
                                colIdx={12}
                                xs={12}
                                color={
                                  itemEstoque.nota ? "text-roxo" : "text-danger"
                                }
                              />
                            </Row>
                          </Tab>
                          <Tab
                            eventKey="imagens"
                            title={
                              <span className="d-flex align-items-center gap-2">
                                <Package size={18} /> Imagens
                              </span>
                            }
                          >
                            <div className="p-2 animate-fade-in">
                              {itemEstoque.imgs &&
                              itemEstoque.imgs.length > 0 ? (
                                <Carousel
                                  interval={null}
                                  variant="dark"
                                  className="rounded-4 overflow-hidden border shadow-sm bg-light"
                                >
                                  {itemEstoque.imgs.map((img, idx) => (
                                    <Carousel.Item key={idx}>
                                      <div
                                        className="d-flex align-items-center justify-content-center bg-light"
                                        style={{ height: "300px" }}
                                      >
                                        <img
                                          src={img}
                                          className="mh-100 mw-100 object-fit-contain"
                                          alt={`Imagem ${idx + 1}`}
                                        />
                                      </div>
                                    </Carousel.Item>
                                  ))}
                                </Carousel>
                              ) : (
                                <div className="text-center p-5 bg-light rounded-4 border border-dashed">
                                  <Package
                                    size={48}
                                    className="text-muted mb-2"
                                  />
                                  <p className="text-muted mb-0">
                                    Nenhuma imagem disponível.
                                  </p>
                                </div>
                              )}
                            </div>
                          </Tab>
                        </Tabs>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xl={4} lg={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 bg-roxo text-white">
                      <Card.Body className="p-2">
                        <h5 className="fw-bold mb-2 p-2 d-flex align-items-center gap-2 text-white">
                          <DollarSign size={20} /> Financeiro
                        </h5>
                        <div className="d-flex flex-column gap-3">
                          <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                            <span className="small text-white-50 d-block mb-1">
                              PREÇO DE VENDA
                            </span>
                            <h3 className="fw-bold mb-0">
                              {util.formatMoney(itemEstoque.valor_venda)}
                            </h3>
                          </div>
                          <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                            <span className="small text-white-50 d-block mb-1">
                              CUSTO DE COMPRA
                            </span>
                            <h4 className="fw-bold mb-0 text-white-50">
                              {util.formatMoney(itemEstoque.valor_compra)}
                            </h4>
                          </div>
                          <div className="p-3 rounded-4 bg-white bg-opacity-20 shadow-sm border border-white border-opacity-20 d-flex justify-content-between align-items-center">
                            <div className="flex flex-column w-100">
                              <span className="small text-zinc-400 d-block mb-0 ">
                                LUCRO ESTIMADO
                              </span>
                              <div className="d-flex w-100 position-relative pt-2">
                                <h3 className="fw-bold mb-0 text-success-bright">
                                  +{util.formatMoney(itemEstoque.lucro)}
                                </h3>
                                <div className="position-absolute top-0 end-0">
                                  <span className="badge text-roxo rounded-pill">
                                    {itemEstoque.lucro
                                      ? (
                                          ((itemEstoque.valor_venda -
                                            itemEstoque.valor_compra) /
                                            itemEstoque.valor_venda) *
                                          100
                                        ).toFixed(0)
                                      : 0}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
