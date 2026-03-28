import Header from "./include/Header"
import FooterCatalogo from "./include/Footer"
import useCatalogo from "../../hooks/catalogo/useCatalogo"
import Produtos from "./include/produtos"
import Carrinho from "./include/Carrinho"

export default function Catalogo(){
    const { produtos, carrinho, handleChangeQuantity, totalItens, pedir, carrinhoAberto, setCarrinhoAberto, valorTotal } = useCatalogo()
    
    return(
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa" }}>
            <Header carrinhoAberto={carrinhoAberto} setCarrinhoAberto={setCarrinhoAberto} />
            {
                carrinhoAberto ? (
                    <Carrinho produtos={produtos} carrinho={carrinho} handleChangeQuantity={handleChangeQuantity} totalItens={totalItens} valorTotal={valorTotal} pedir={pedir} />
                ) : (
                    <Produtos produtos={produtos} carrinho={carrinho} handleChangeQuantity={handleChangeQuantity} />
                )
            }

            {totalItens > 0 && (
                <div 
                    className="fixed-bottom d-flex justify-content-center pb-4" 
                    style={{ zIndex: 1000, pointerEvents: "none" }}
                >
                    <button 
                        className="btn btn-lg shadow fs-5 fw-bold d-flex align-items-center gap-2 text-white"
                        style={{ backgroundColor: "#25D366", pointerEvents: "auto", borderRadius: "30px", padding: "12px 30px" }}
                        onClick={pedir}
                    >
                        <span>{carrinhoAberto ? "Finalizar Pedido" : "Ver Carrinho"}</span>
                        <span className="badge bg-white text-dark rounded-pill ms-2">{totalItens}</span>
                    </button>
                </div>
            )}
            <FooterCatalogo />
        </div>
    )
}