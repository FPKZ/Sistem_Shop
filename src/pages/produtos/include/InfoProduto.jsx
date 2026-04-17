import { useParams, useOutletContext } from "react-router-dom";
import API from "@services/index";
import util from "@services/utils.js";
import useInfoProdutos from "@hooks/produtos/useInfoProdutos";
import useEditarProduto from "@hooks/produtos/useEditarProduto";
import { usePermissoes } from "@hooks/auth/usePermissoes";

import ImageCropModal from "@components/modal/ImageCropModal";
import GerenciarImagensModal from "@components/modal/GerenciarImagensModal";
import ImageCarousel from "@components/ImageCarousel";
import TabelaProdutos from "@tabelas/TabelaProduto.jsx";
import EditarProdutoModal from "@components/modal/InfoProdutos/EditarProdutoModal";
import EditarItemEstoqueModal from "@components/modal/InfoProdutos/EditarItemEstoqueModal";

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
  Palette
} from "lucide-react";
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
  Container
} from "react-bootstrap";


export default function InfoProduto() {
    const { id } = useParams();
    const { mobile } = useOutletContext();
    const { data: produto, isLoading, error } = API.getProdutos({ id });

    const { pode } = usePermissoes();

    // console.log(`id: ${id} | data:`, produto, ` | isLoading: ${isLoading} | error: ${error}`);

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
    showEditProduto,
    setShowEditProduto,
    showEditItem,
    setShowEditItem,
    itemParaEditar,
    // setItemParaEditar,
    handleEditItem,
  } = useInfoProdutos({ visible: true, tableShow: true, produto });

  const { imageUpload, removeImagem, updateImage, deletarProduto, isLoading: isUpdating } = useEditarProduto(produto);


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
      <div className="p-3 px-3 rounded-4 bg-light border border-opacity-10 h-100 shadow-sm">
        <div className="d-flex align-items-center gap-2 mb-2">
          {Icon && <Icon size={12} className="text-roxo" />}
          <span
            className="text-muted fw-bold text-uppercase"
            style={{ fontSize: "0.9rem", letterSpacing: "0.05rem" }}
          >
            {label}
          </span>
        </div>
        <div className={`fw-semibold ${color} text-truncate text-[0.8rem]`}>
          {value || "---"}
        </div>
      </div>
    </Col>
  );
    const sizeImg = "14rem"
    const tabClassName = (tab) => `bg-transparent! border-0! py-3 transition-all ${
        activeTab === tab 
        ? "text-roxo! border-bottom! border-roxo! fw-bold" 
        : "text-muted hover:text-roxo"
    }`
        
    return (
        <div className="w-100 h-100">
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-roxo" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    Erro ao carregar produto: {error.message}
                </div>
            ) : (
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

                <EditarProdutoModal 
                    visible={showEditProduto} 
                    onClose={() => setShowEditProduto(false)} 
                    produto={produto} 
                />

                <EditarItemEstoqueModal 
                    visible={showEditItem} 
                    onClose={() => setShowEditItem(false)} 
                    item={itemParaEditar} 
                />

                <Container fluid>
                    <div className="animate-fade-in">
                        {/* Cabeçalho do Produto */}
                        <div className="d-flex flex-column flex-md-row gap-3 mb-2 pb-2 border-bottom align-items-center align-items-md-stretch">
                            <Dropdown className="group">
                                <Dropdown.Toggle
                                    disabled={!pode("editarProduto")}
                                    variant="none"
                                    className="bg-light rounded-4 border p-2 shadow-sm position-relative dropdown-toggle-no-caret overflow-hidden disabled:opacity-100!"
                                    style={{
                                        width: sizeImg,
                                        height: sizeImg,
                                        minWidth: sizeImg,
                                    }}
                                >
                                    {pode("editarProduto") ? (
                                        <>
                                            <div className="bg-stone-400 w-100 h-100 position-absolute top-0 end-0 rounded-3 opacity-0 group-hover:opacity-30! transition-all ease-in-out duration-300 z-10">
                                            </div>
                                            <div
                                                className="position-absolute top-[45%] left-[45%] translate-middle m-2 rounded-3 opacity-0 group-hover:opacity-100! transition-all ease-in-out duration-300"
                                                style={{ zIndex: 10 }}
                                            >
                                                <Edit size={24} className="text-white/80" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="hidden"></div>
                                    )}
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
                            <div className="grow d-flex flex-column md:flex-row! justify-between md:gap-4">
                                <div className="flex flex-col items-center md:items-start!">
                                    <div className="d-flex align-items-center md:align-items-start! gap-2 mb-2 md:order-2">
                                        {getStatusBadge(produto.itemEstoque?.some((item) => item.status === "Disponivel") ? "Disponivel" : "Esgotado")}
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
                                    <h3 className="fw-bold mb-0 text-[3rem]!">{produto.nome}</h3>
                                    <p className="text-muted text-center text-md-start p-2 mb-2">
                                    {produto.descricao || "Sem descrição disponível."}
                                    </p>
                                </div>
                                <div className="d-flex w-100 md:w-auto! md:flex-col! justify-center! gap-2 mb-2">
                                    {pode("editarProduto") && (
                                        <Button
                                            variant="roxo"
                                            className="d-flex align-items-center gap-2 px-4 shadow-sm"
                                            onClick={() => setShowEditProduto(true)}
                                        >
                                            <Edit size={18} /> Editar
                                        </Button>
                                    )}
                                    {pode("deletarProduto") && (
                                        <Button
                                            variant="outline-danger"
                                            className="d-flex align-items-center gap-2 px-4"
                                            onClick={() => deletarProduto(itemEstoque.id)}
                                        >
                                            <Trash2 size={18} /> Excluir
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Grid de Informações */}
                        
                        <Row className="g-3 position-relative">
                            {activeTab === "imagens" && !mobile && pode("editarProduto") && (
                                <div 
                                    className="position-absolute w-auto top-1 end-2 cursor-pointer d-flex align-items-center gap-1 hover-opacity shadow-sm bg-white p-2 rounded-3 border z-10"
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
                                className="mb-0"
                            >
                                <Tab
                                    eventKey="tecnico"
                                    title={
                                    <span className="d-flex align-items-center gap-2">
                                        <InfoIcon size={18} /> Info. Técnica
                                    </span>
                                    }
                                    tabClassName={tabClassName("tecnico")}
                                >
                                    {!itemEstoque.id && !itemEstoque._id ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5">
                                            <div className="d-flex align-items-center bg-light rounded-circle p-3 mb-3 shadow-sm">
                                                <Package size={48} className="text-roxo" />
                                            </div>
                                            <h4 className="fw-bold text-muted">Nenhum item selecionado</h4>
                                            <p className="text-muted small">
                                            Selecione um item na lista ao lado para visualizar suas informações detalhadas.
                                            </p>
                                        </div>
                                        ) : (<>
                                        <Row className="g-3">
                                            <Col xl={8} lg={12}>
                                                <Card className="border-0 shadow-sm rounded-4 h-100">
                                                <Card.Body className="p-3 position-relative">
                                                    
                                                    <Row className="g-3 animate-fade-in">
                                                        <div className="d-flex align-items-center justify-content-between w-100">
                                                            <span className="d-flex align-items-center fw-semibold fs-5 text-roxo gap-2">
                                                                <InfoIcon size={18} strokeWidth={3} /> Informações Técnicas
                                                            </span>
                                                            <Button 
                                                                variant="outline-roxo" 
                                                                size="sm" 
                                                                className="d-flex align-items-center gap-2 rounded-pill px-3"
                                                                onClick={() => handleEditItem(itemEstoque)}
                                                            >
                                                                <Edit size={14} /> Editar Item
                                                            </Button>
                                                        </div>
                                                    
                                                        <InfoBlock
                                                            label="Marca"
                                                            value={itemEstoque.marca}
                                                            icon={Package}
                                                            colIdx={6}
                                                            xs={12}
                                                        />
                                                        <InfoBlock
                                                            label="Tamanho"
                                                            value={itemEstoque.tamanho}
                                                            icon={Layers}
                                                            colIdx={4}
                                                            xs={8}
                                                        />
                                                        <Col md={2} xs={4} className="mb-2">
                                                            <div className="p-3 pt-2 rounded-4 bg-light border border-opacity-10 h-100 shadow-sm d-flex flex-column align-items-center">
                                                                <div className="d-flex items-center gap-2 mb-1 w-100">
                                                                    <Palette size={12} className="text-roxo" />
                                                                    <span
                                                                        className="text-muted small fw-bold text-uppercase"
                                                                        style={{ fontSize: "0.9rem" }}
                                                                    >
                                                                        COR
                                                                    </span>

                                                                </div>
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
                                    </>)}
                                    <div className="w-100 max-h-[50dvh] mt-3 pt-2 border bg-neutral-300/40 rounded-4 inset-shadow-sm inset-ring-2 inset-ring-neutral-300/30">
                                        <TabelaProdutos
                                            mobile={mobile}
                                            produto={produto}
                                            setItemEstoque={setItemEstoque}
                                            onEditItem={handleEditItem}
                                            active={itemEstoque.id}
                                            width={12}
                                            custom={` ${mobile ? "border-bottom" : ""}`}
                                        />
                                    </div>
                                </Tab>
                                <Tab
                                    eventKey="imagens"
                                    title={
                                    <span className="d-flex align-items-center gap-2">
                                        <Package size={18} /> Imagens
                                    </span>
                                    }
                                    tabClassName={tabClassName("imagens")}
                                >
                                    <div className="flex flex-column items-center gap-3 p-2 animate-fade-in">
                                        <ImageCarousel
                                            imgs={produto.imgs}
                                            height={mobile ? "" : produto.imgs?.length > 0 ? "40rem" : "20rem"}
                                            objectFit="contain"
                                            className="w-70"
                                        />
                                        {mobile && (
                                            <div 
                                                className="w-fit cursor-pointer d-flex align-items-center gap-1 shadow-sm bg-white p-2 rounded-3 border"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setModalImagens(true)}
                                            >
                                                <Edit size={24} className="text-roxo" /> 
                                                <span className="text-[1.2rem] fw-semibold text-roxo">Gerenciar Imagens</span>
                                            </div>
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Row>

                    </div>
                    
                </Container>
                </>
            )}
        </div>
    );
}