

export default function Produtos({produtos, carrinho, handleChangeQuantity}){
    return (
        <main className="container my-4 flex-grow-1">
            <h2 className="mb-4 text-center" style={{ fontWeight: "600" }}>
                Catálogo de Produtos
            </h2>

            {produtos.length === 0 ? (
                <div className="text-center text-muted mt-5">Carregando produtos ou o catálogo está vazio...</div>
            ) : (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 align-items-stretch g-4 mb-4">
                    {produtos.map((produto) => {
                        const quantidade = carrinho[produto.id] || 0;
                        return (
                            <div className="col hover:translate-y-[-5px] transition-transform duration-300" key={produto.id}>
                                <div className="rounded-4 bg-white shadow-sm border-0 h-100 d-flex flex-column overflow-hidden">
                                    <div
                                        className="produto-img-wrapper"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "hidden",
                                            // height: "12rem",
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
                                        <div className="fw-bold fs-5 text-success mb-2">
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