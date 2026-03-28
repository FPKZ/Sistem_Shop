export default function Carrinho({produtos,carrinho,handleChangeQuantity, totalItens, valorTotal, pedir}){
    

    return (
        <main className="container my-4 flex-grow-1">
            <h2 className="mb-4 text-center" style={{ color: "rgba(147, 51, 179, 1)", fontWeight: "600" }}>
                Meu Carrinho
            </h2>

            {Object.keys(carrinho).length === 0 ? (
                <div className="text-center text-muted mt-5">Seu carrinho está vazio.</div>
            ) : (
                <div className="d-flex flex-column gap-3 mb-5 pb-5">
                    {Object.entries(carrinho).map(([id, quantidade]) => {
                        const produto = produtos.find(p => p.id === Number(id));
                        if (!produto) return null;
                        
                        return (
                            <div className="card shadow-sm border-0 flex-row align-items-center p-2" key={id}>
                                <div style={{ width: "80px", height: "80px", flexShrink: 0, backgroundColor: "#fff", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", borderRadius: "8px" }}>
                                    <img 
                                        src={produto.img || produto.imagem || "assets/tube-spinner.svg"} 
                                        alt={produto.nome} 
                                        style={{ objectFit: "contain", height: "100%", width: "100%", padding: "0.2rem" }}
                                    />
                                </div>
                                <div className="ms-3 flex-grow-1 d-flex flex-column justify-content-center">
                                    <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: "200px" }} title={produto.nome}>{produto.nome}</h6>
                                    <div className="fw-bold text-success mb-2">
                                        R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                                    </div>
                                    <div className="d-flex align-items-center p-1" style={{ backgroundColor: "#f1f3f5", borderRadius: "8px", width: "fit-content" }}>
                                        <button 
                                            className="btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: "28px", height: "28px", border: "1px solid #dee2e6" }} 
                                            onClick={() => handleChangeQuantity(produto.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="fw-bold fs-6 mx-3">{quantidade}</span>
                                        <button 
                                            className={`btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center ${quantidade >= produto.quantidade ? "disabled" : ""}`}
                                            style={{ width: "28px", height: "28px", border: "1px solid #dee2e6" }}
                                            onClick={() => handleChangeQuantity(produto.id, 1)}
                                            disabled={quantidade >= produto.quantidade}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="ms-auto pe-2 text-end">
                                    <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                                        R$ {(Number(produto.preco || 0) * quantidade).toFixed(2).replace('.', ',')}
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
        </main>
    )
}