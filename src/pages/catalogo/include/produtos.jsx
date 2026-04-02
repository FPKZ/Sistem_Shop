import { Dropdown } from "react-bootstrap";
import { ArrowDown, ListFilter, ArrowDownWideNarrow, Search, X } from "lucide-react";


export default function Produtos({produtos, ordenarPorChave, setFiltro, filtro, carrinho, handleChangeQuantity}){
    return (
        <main className="px-2 flex-grow-1">
            <h2 className="flex items-center gap-2 mb-4">
                <div className="flex-grow-1 position-relative">
                    <input type="text" className="form-control" placeholder="Buscar produtos" value={filtro.nome || ""} onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} />
                    <div className="flex justify-content-center align-items-center position-absolute top-5 end-3 translate-middle-y">
                        {
                            filtro.nome ? (
                                <button className="d-flex align-items-center justify-content-center" onClick={() => setFiltro({ ...filtro, nome: "" })}>
                                    <X size={15} color="#9333b3" />
                                </button>
                            ) : (
                                <Search size={15} color="#9333b3" />
                            )
                        }
                    </div>
                </div>
                <Dropdown>
                    <Dropdown.Toggle className="dropdown-toggle-none" variant="none" id="dropdown-basic">
                        <div className="flex items-center gap-0">
                            <ArrowDownWideNarrow size={25} />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => ordenarPorChave("preco", "desc")}>Maior preço</Dropdown.Item>
                        <Dropdown.Item onClick={() => ordenarPorChave("preco", "asc")}>Menor preço</Dropdown.Item>
                        <Dropdown.Item onClick={() => ordenarPorChave("nome", "asc")}>Ordem alfabética</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </h2>

            {produtos === undefined || produtos.length === 0 ? (
                <div className="text-center text-muted mt-5">Carregando produtos ou o catálogo está vazio...</div>
            ) : (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-5 align-items-stretch g-4 ">
                    {produtos.map((produto) => {
                        const quantidade = carrinho[produto.id] || 0;
                        return (
                            <div className="col hover:translate-y-[-5px] transition-transform duration-300" key={produto.id}>
                                <div className="rounded-4 bg-white shadow-sm border-0 h-100 min-h-[25rem] d-flex flex-column overflow-hidden">
                                    <div
                                        className="produto-img-wrapper"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "hidden",
                                            height: "60%",
                                        }}
                                    >
                                        <img
                                            className="card-img-top produto-img"
                                            src={produto.img || produto.imagem || "assets/tube-spinner.svg"}
                                            alt={produto.nome}
                                            style={{
                                                objectFit: "cover",
                                                height: "100%",
                                                width: "100%",
                                                padding: "0",
                                            }}
                                        />
                                    </div>
                                    <div className="card-body p-3 d-flex flex-column flex-grow-1">
                                        <h5 className="card-title text-truncate fw-bold mb-1" title={produto.nome}>
                                            {produto.nome}
                                        </h5>
                                        <p className="card-text text-muted small mb-2" style={{ flexGrow: 1 }}>
                                            {produto.descricao ? 
                                                (produto.descricao.length > 50 ? produto.descricao.substring(0, 50) + "..." : produto.descricao) 
                                                : "Sem descrição"}
                                        </p>
                                        <div className="fw-bold fs-5 text-success mb-0">
                                            R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                                        </div>
                                    </div>
                                    <div className="card-footer border-top-0 p-3 pt-0 mt-auto">
                                        {quantidade === 0 ? (
                                            <button 
                                                className="btn w-100 fw-bold border-0 text-white shadow-sm" 
                                                style={{ backgroundColor: "rgba(147, 51, 179, 1)", borderRadius: "8px" }}
                                                onClick={() => handleChangeQuantity(produto.id, 1)}
                                            >
                                                Adicionar
                                            </button>
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-between p-1 shadow-sm" style={{ backgroundColor: "#f1f3f5", borderRadius: "8px" }}>
                                                <button 
                                                    className="btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }} 
                                                    onClick={() => handleChangeQuantity(produto.id, -1)}
                                                >
                                                    -
                                                </button>
                                                <span className="fw-bold fs-6">{quantidade}</span>
                                                <button 
                                                className={`btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center ${quantidade >= produto.quantidade ? "disabled" : ""}`}
                                                    style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }}
                                                    onClick={() => handleChangeQuantity(produto.id, 1)}
                                                    disabled={quantidade >= produto.quantidade}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    )
}