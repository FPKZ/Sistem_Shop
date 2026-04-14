import util from "@services/utils.js";
import {
  Modal,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Tabs,
  Tab,
  Dropdown,
} from "react-bootstrap";
import ImageCarousel from "@components/ImageCarousel";
import TabelaProdutos from "@tabelas/TabelaProduto.jsx";
import GerenciarImagensModal from "@components/modal/GerenciarImagensModal";
import ImageCropModal from "@components/modal/ImageCropModal";
import useInfoProdutos from "@hooks/produtos/useInfoProdutos";
import useEditarProduto from "@hooks/produtos/useEditarProduto";
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
  const {
    itemEstoque,
    setItemEstoque,
    // detailsRef,
    activeTab,
    setActiveTab,
    modalImagens,
    setModalImagens,
    activeTabModalImagens,
    setActiveTabModalImagens,
  } = useInfoProdutos({ visible, tableShow, produto });

  const { imageUpload, removeImagem, updateImage, isLoading: isUpdating } = useEditarProduto(produto);

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
    <>
      {/* Modais de Gerenciamento de Imagem (Apenas renderiza junto com o pai) */}
      <GerenciarImagensModal
        visible={modalImagens}
        onClose={() => setModalImagens(false)}
        imagens={produto?.imgs || []}
        onRemove={removeImagem}
        activeTab={activeTabModalImagens}
        onTabChange={setActiveTabModalImagens}
        imageUpload={imageUpload}
        mobile={mobile}
      />

      <ImageCropModal
        src={imageUpload.cropSrc}
        visible={imageUpload.showCrop}
        onClose={imageUpload.handlers.handleCropCancel}
        onConfirm={imageUpload.handlers.handleCropConfirm}
        aspect={1}
      />

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
          // height: mobile ? "auto" : "75dvh",
          // minHeight: mobile ? "auto" : "550px",
          padding: 0,
        }}
        className={`rounded-bottom-4 ${mobile ? "overflow-auto" : "overflow-hidden"} bg-white`}
      >
        <Row className="h-100 g-0">
          {/* Tabela lateral opcional */}
          {tableShow && (
            <TabelaProdutos
              mobile={mobile}
              produto={produto}
              setItemEstoque={setItemEstoque}
              width={mobile ? 12 : 5}
              custom={` ${mobile ? "border-bottom" : ""}`}
            />
          )}

          {/* Área de Detalhes Principal */}
          <Col
            lg={tableShow ? 7 : 12}
            xl={tableShow ? 7 : 12}
            className={`${mobile ? "order-1" : "order-md-2 h-100 overflow-y-auto custom-scrollbar"} p-3 p-md-3 pt-md-0 `}
          >
              <div className="animate-fade-in">
                {/* Cabeçalho do Produto */}
                <div className="d-flex flex-column flex-md-row gap-3 mb-2 pb-2 border-bottom align-items-start align-items-md-center">
                  <Dropdown className="group">
                    <Dropdown.Toggle
                      variant="none"
                      className="bg-light rounded-4 border p-2 shadow-sm position-relative dropdown-toggle-no-caret overflow-hidden"
                      style={{
                        width: "140px",
                        height: "140px",
                        minWidth: "140px",
                      }}
                    >
                      <div className="bg-stone-400 w-100 h-100 position-absolute top-0 end-0 rounded-3 opacity-0 group-hover:opacity-30! transition-all ease-in-out duration-300 z-10">
                      </div>
                      <div
                        className="position-absolute top-[45%] left-[45%] translate-middle m-2 rounded-3 opacity-0 group-hover:opacity-100! transition-all ease-in-out duration-300"
                        style={{ zIndex: 10 }}
                      >
                        <Edit size={24} className="text-white/80" />
                      </div>
                      <div className="w-100 h-100 position-relative">
                        <img
                          className={`w-100 h-100 rounded-3 object-fit-cover transition-all duration-300 ${isUpdating ? 'opacity-50 blur-sm' : ''}`}
                          src={
                            produto.img
                              ? produto.img
                              : "assets/tube-spinner.svg"
                          }
                          alt={produto.nome}
                        />
                        {isUpdating && (
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <div className="spinner-border text-roxo" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0 shadow-sm" style={{ width: '320px' }}>
                      <div className="d-flex flex-wrap gap-1 p-0 custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto', justifyContent: 'center' }}>
                        {produto?.imgs?.map((img, index) => (
                          <Dropdown.Item
                            className="w-auto cursor-pointer hover:bg-transparent! active:bg-transparent!"
                            key={index}
                            as="div"
                            onClick={() => updateImage(img)}
                          >
                            <div
                              style={{
                                backgroundColor: '#FFFFFF',
                                width: '5rem',
                                height: '5rem',
                                borderRadius: '10%',
                                marginBottom: '5px',
                                border: '1px solid #ccc',
                                overflow: "hidden"
                              }}
                            >
                              <img src={img} alt={produto.nome} />
                            </div>
                          </Dropdown.Item>
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div className="grow">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      {!itemEstoque.id && !itemEstoque._id ? null : getStatusBadge(itemEstoque.status)}
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
                {!itemEstoque.id && !itemEstoque._id ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5">
                    <div className="mb-3">
                      <img
                        src="assets/tube-spinner.svg"
                        alt="Sem Imagem"
                        className="img-fluid"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                    <h4 className="fw-bold text-muted">Nenhum produto selecionado</h4>
                    <p className="text-muted small">
                      Selecione um produto na lista ao lado para visualizar suas informações detalhadas.
                    </p>
                  </div>
                ) : (
                <Row className="g-3">
                  <Col xl={8} lg={12}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body className="p-3 position-relative">
                        {activeTab === "imagens" && (
                          <div 
                            className="position-absolute top-0 end-0 m-3 cursor-pointer d-flex align-items-center gap-1 hover-opacity shadow-sm bg-white p-2 rounded-3 border z-10"
                            style={{ zIndex: 10, cursor: "pointer" }}
                            onClick={() => setModalImagens(true)}
                          >
                            <Edit size={16} className="text-roxo" /> 
                            <span className="small fw-semibold text-roxo">Gerenciar Imagens</span>
                          </div>
                        )}
                        <Tabs
                          activeKey={activeTab}
                          onSelect={(k) => setActiveTab(k)}
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
                              <ImageCarousel
                                imgs={produto.imgs}
                                height="300px"
                                objectFit="contain"
                              />
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
                )}
              </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  </>
  );
}
