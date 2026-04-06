import { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Header from "./include/Header";
import FooterCatalogo from "./include/Footer";
import Produtos from "./include/Produtos";
import Carrinho from "./include/Carrinho";
import Produto from "./include/Produto";
import Menu from "./include/Menu";

//Hooks
import useCatalogo from "../../hooks/catalogo/useCatalogo";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { useHistoryBack } from "../../hooks/useHistoryBack";

export default function Catalogo() {
  const {
    produtos,
    categorias,
    produtoSelecionado,
    selecionarProduto,
    telaProduto,
    setTelaProduto,
    carrinho,
    formValue,
    handleChange,
    handleChangeQuantity,
    handleBadge,
    adicionarAoCarrinho,
    removerItemDoCarrinho,
    alterarQuantidade,
    totalItens,
    valorTotal,
    obs,
    setObs,
    pedir,
    carrinhoAberto,
    setCarrinhoAberto,
    menu,
    setMenu,
    loading,
    getCor,
    handleTalk,
  } = useCatalogo();

  const { dadosProcessados, filtro, setFiltro, ordenarPorChave } = useFiltroOrdenacao(produtos, [
    "nome",
    "categoria",
    { path: "tags", subCampos: ["label"] },
  ]);

  const topRef = useRef(null);
  const [talkExpanded, setTalkExpanded] = (useCatalogo.expandedState || useState)(false);
  const [isHovered, setIsHovered] = useState(false);

  const whatsappVariants = {
    collapsed: { x: 115 },
    expanded: { x: 15 }
  };

  // 1. Controle de Posição de Rolagem Inteligente
  useScrollRestoration(carrinhoAberto || telaProduto, topRef);

  // 2. Controle do Botão Voltar (Android / Navegador)
  useHistoryBack([
    { isOpen: carrinhoAberto, close: () => setCarrinhoAberto(false) },
    { isOpen: telaProduto, close: () => setTelaProduto(false) },
    { isOpen: menu, close: () => setMenu(false) }
  ]);

  return (
    <div className="d-flex flex-column h-100" ref={topRef}>
      {/* Header fixo no topo ocupando toda a largura */}
      <Header
        carrinhoAberto={carrinhoAberto}
        telaProduto={telaProduto}
        voltar={() => window.history.back()}
        setMenuAberto={() => setMenu(true)}
      />

      <div className="d-lg-flex flex-grow-1">
        {/* Sidebar Desktop - Abaixo do Header */}
        {
            !carrinhoAberto && !telaProduto && (
                <aside
                className="d-none d-lg-block border-end bg-white shadow-sm"
                style={{
                    minWidth: "20%",
                    position: "sticky",
                    top: "0px", // O Menu agora começa do topo da área de conteúdo (abaixo do header)
                    height: "fit-content",
                    maxHeight: "100vh",
                    overflowY: "auto",
                    zIndex: 10
                }}
                >
                <Menu categorias={categorias} setFiltro={setFiltro} filtro={filtro} />
                </aside>
            )
        }

        {/* Menu Mobile (Offcanvas) */}
        <div className="d-lg-none">
          <Menu
            categorias={categorias}
            setFiltro={setFiltro}
            filtro={filtro}
            isOpen={menu}
            onClose={() => setMenu(false)}
            isMobile
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column bg-light bg-opacity-10">
          <main className="flex-grow-1 container-fluid py-4 pt-3">
            {carrinhoAberto ? (
              <Carrinho
                produtos={produtos}
                carrinho={carrinho}
                removerItemDoCarrinho={removerItemDoCarrinho}
                alterarQuantidade={alterarQuantidade}
                totalItens={totalItens}
                valorTotal={valorTotal}
                pedir={pedir}
                obs={obs}
                setObs={setObs}
                getCor={getCor}
              />
            ) : telaProduto ? (
              <Produto 
                produto={produtoSelecionado} 
                handleChangeQuantity={handleChangeQuantity} 
                formValue={formValue} 
                handleChange={handleChange} 
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            ) : (
              <Produtos
                produtos={dadosProcessados}
                ordenarPorChave={ordenarPorChave}
                setFiltro={setFiltro}
                filtro={filtro}
                handleBadge={handleBadge}
                handleChangeQuantity={handleChangeQuantity}
                selecionarProduto={selecionarProduto}
                setTelaProduto={setTelaProduto}
              />
            )}
          </main>

          <motion.button
            initial="collapsed"
            animate={talkExpanded ? "expanded" : "collapsed"}
            whileHover="expanded"
            whileTap={{ scale: 0.95 }}
            variants={whatsappVariants}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => {
              if (isHovered || talkExpanded) {
                handleTalk();
              } else {
                setTalkExpanded(true);
              }
            }}
            className="
              position-fixed bottom-30 end-0 
              flex items-center justify-between gap-2
              rounded-start-5 border-0"
            style={{ 
              width: "12rem",
              height: "4rem",
              color: "#ffffff", 
              backgroundColor: "#25D366", 
              padding: "1rem", 
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", 
              zIndex: 1000 
            }}
          >
            <i className="bi bi-whatsapp fs-1"></i>
            <span className="text-[1rem] fw-bold">Fale com vendedor!</span>
          </motion.button>


          {/* Botão Flutuante para abrir o carrinho */}
          {totalItens > 0 && (
            <div
              className="fixed-bottom d-flex justify-content-center pb-4"
              style={{ zIndex: 1000, pointerEvents: "none" }}
            >
              <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={loading ? {} : { scale: 1.05 }}
                whileTap={loading ? {} : { scale: 0.95 }}
                className="btn btn-lg shadow fs-5 fw-bold d-flex align-items-center gap-2 text-white"
                style={{
                  backgroundColor: loading ? "#9e9e9e" : "#25D366",
                  pointerEvents: loading ? "none" : "auto",
                  borderRadius: "30px",
                  padding: "12px 30px",
                }}
                onClick={pedir}
                disabled={loading}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="d-flex align-items-center gap-2"
                    >
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Processando...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="d-flex align-items-center gap-2"
                    >
                      <span>
                        {carrinhoAberto ? "Finalizar Pedido" : "Ver Carrinho"}
                      </span>
                      <span className="badge bg-white text-dark rounded-pill">
                        {totalItens}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          )}
        </div>
      </div>
      <FooterCatalogo />
    </div>
  );

}
