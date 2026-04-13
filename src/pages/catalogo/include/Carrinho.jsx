import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Carrinho({produtos, carrinho, alterarQuantidade, removerItemDoCarrinho, valorTotal, obs, setObs}){
    const [showObs, setShowObs] = useState(false);

    return (
        <main className="container my-4 flex-grow-1">
            <h2 className="mb-4 text-center" style={{ color: "rgba(147, 51, 179, 1)", fontWeight: "600" }}>
                Meu Carrinho
            </h2>

            {carrinho.length === 0 ? (
                <div className="text-center text-muted mt-5">Seu carrinho está vazio.</div>
            ) : (
                <div className="d-flex flex-column gap-3 mb-2 pb-2">
                    {carrinho.map((item, i) => {
                        const produto = produtos.find(p => p.id === Number(item.id));
                        if (!produto) return null;
                        
                        return (
                            <div className="card shadow-sm border-0 flex-row align-items-stretch p-0 overflow-hidden" key={`${item.id}-${item.cor}-${item.tamanho}`}>
                                <div style={{ width: "6rem", minHeight: "6rem", flexShrink: 0, backgroundColor: "#fff", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                                    <img 
                                        src={Array.isArray(produto.imgs) ? produto.imgs[0] : produto.imagem || "assets/tube-spinner.svg"} 
                                        alt={produto.nome} 
                                        style={{ objectFit: "cover", height: "100%", width: "100%" }}
                                    />
                                </div>

                                <div className="ms-3 flex-grow-1 d-flex flex-column justify-content-between p-2 gap-1">
                                    <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: "200px" }} title={produto.nome}>{produto.nome}</h6>
                                    <div className="d-flex align-items-center gap-1">
                                        <span className="fw-bold text-muted text-[0.8rem]">{item.tamanho}</span>
                                        <Minus size={10} strokeWidth={2.5} />
                                        <div className="d-flex align-items-center gap-1">
                                            <div className="rounded-circle" style={{ width: "12px", height: "12px", backgroundColor: item.cor }}></div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center p-1" style={{ backgroundColor: "#f1f3f5", borderRadius: "8px", width: "fit-content" }}>
                                        <button 
                                            className={`
                                                ${item.quantidade === 1 ? "bg-white hover:bg-red-500! hover:text-white!" : "bg-white hover:bg-stone-300!"}
                                                transition-all duration-200 ease-in-out
                                                text-[12px] fw-bold rounded-circle 
                                                d-flex align-items-center justify-content-center`}
                                            style={{ width: "28px", height: "28px", border: "1px solid #dee2e6" }} 
                                            onClick={() => {
                                                if (item.quantidade === 1) {
                                                    removerItemDoCarrinho(i);
                                                } else {
                                                    alterarQuantidade(i, produto.id, -1);
                                                }
                                            }}
                                        >
                                            {item.quantidade === 1 ? <Trash2  size={13} strokeWidth={2.5} /> : <Minus size={13} strokeWidth={2.5} />}
                                        </button>
                                        <span className="fw-bold fs-6 mx-3">{item.quantidade}</span>
                                        <button 
                                            className={`
                                                ${item.quantidade >= produto.quantidade ? "bg-stone-300! text-stone-600!" : "bg-white hover:bg-stone-300!"}
                                                transition-all duration-200 ease-in-out
                                                fw-bold rounded-circle 
                                                d-flex align-items-center justify-content-center
                                            `}
                                            style={{ width: "28px", height: "28px", border: "1px solid #dee2e6" }}
                                            onClick={() => alterarQuantidade(i, produto.id, 1)}
                                        >
                                            <Plus size={13} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end ms-auto pe-3 py-3 text-end">
                                    <div className="fw-bold text-success text-[0.7rem] mb-2">
                                        Uni. R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                                    </div>
                                    <div className="fw-bold" style={{ fontSize: "1rem" }}>
                                        R$ {(Number(produto.preco || 0) * item.quantidade).toFixed(2).replace('.', ',')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="card shadow-sm border-0 p-3 mt-3 bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-5 fw-bold text-muted">Total da compra:</span>
                            <span className="fs-4 fw-bold" style={{ color: "rgba(147, 51, 179, 1)" }}>
                                R$ {valorTotal.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="card shadow-sm border-0 p-3 mt-3 bg-white ">
                <div 
                    className="d-flex align-items-center justify-content-between" 
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowObs(!showObs)}
                >
                    <span className="fw-bold text-muted mb-0">Observações:</span>
                    <i className={`bi bi-chevron-${showObs ? 'up' : 'down'} text-muted`}></i>
                </div>
                {showObs && (
                    <textarea className="form-control bg-light mt-2" placeholder="Digite aqui suas observações..." value={obs} onChange={(e) => setObs(e.target.value)} />
                )}
            </div>

        </main>
    )
}
