import Header from "./include/Header";
import FooterCatalogo from "./include/Footer";
import Produtos from "./include/produtos";
import Carrinho from "./include/Carrinho";
import Menu from "./include/Menu";

//Hooks
import useCatalogo from "../../hooks/catalogo/useCatalogo";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";

export default function Catalogo() {
  const {
    produtos,
    carrinho,
    handleChangeQuantity,
    totalItens,
    valorTotal,
    obs,
    setObs,
    pedir,
    carrinhoAberto,
    setCarrinhoAberto,
    menu,
    setMenu,
  } = useCatalogo();

  const { dadosProcessados, filtro, setFiltro, ordenarPorChave } = useFiltroOrdenacao(produtos, [
    "nome",
    "categoria",
    { path: "tags", subCampos: ["label"] },
  ]);

  const categorias = [
    ...new Set(produtos.map((p) => p.categoria).filter(Boolean)),
  ].sort();

//   console.log(dadosProcessados);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Header fixo no topo ocupando toda a largura */}
      <Header
        carrinhoAberto={carrinhoAberto}
        setCarrinhoAberto={setCarrinhoAberto}
        setMenuAberto={() => setMenu(true)}
      />

      <div className="d-lg-flex flex-grow-1">
        {/* Sidebar Desktop - Abaixo do Header */}
        {
            !carrinhoAberto && (
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
                handleChangeQuantity={handleChangeQuantity}
                totalItens={totalItens}
                valorTotal={valorTotal}
                pedir={pedir}
                obs={obs}
                setObs={setObs}
              />
            ) : (
              <Produtos
                produtos={dadosProcessados}
                ordenarPorChave={ordenarPorChave}
                setFiltro={setFiltro}
                filtro={filtro}
                carrinho={carrinho}
                handleChangeQuantity={handleChangeQuantity}
              />
            )}
          </main>

          {totalItens > 0 && (
            <div
              className="fixed-bottom d-flex justify-content-center pb-4"
              style={{ zIndex: 1000, pointerEvents: "none" }}
            >
              <button
                className="btn btn-lg shadow fs-5 fw-bold d-flex align-items-center gap-2 text-white"
                style={{
                  backgroundColor: "#25D366",
                  pointerEvents: "auto",
                  borderRadius: "30px",
                  padding: "12px 30px",
                }}
                onClick={pedir}
              >
                <span>
                  {carrinhoAberto ? "Finalizar Pedido" : "Ver Carrinho"}
                </span>
                <span className="badge bg-white text-dark rounded-pill ms-2">
                  {totalItens}
                </span>
              </button>
            </div>
          )}
          <FooterCatalogo />
        </div>
      </div>
    </div>
  );

}
