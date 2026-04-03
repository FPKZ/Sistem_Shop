

export default function Produto({produto, handleChangeQuantity, formValue, handleChange, adicionarAoCarrinho}) {

    return (
        <>
            <main className="container-fluid">
                <div className="card rounded-4 overflow-hidden shadow-md">
                    <div className="row m-0 p-0">
                        <div className="col-12 col-md-6 p-0">
                            <div className="card-img"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            >
                                <img src={produto.imagem || produto.img || "assets/tube-spinner.svg"}
                                    alt={produto.nome}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="card-body col-12 col-md-6 p-0 position-relative">
                            <div className="flex flex-column p-3 gap-2">
                                <h5 className="card-title fw-bold text-[2rem]!">{produto.nome}</h5>
                                <p className="card-text text-muted">{produto.descricao}</p>
                                <p className="card-text text-success fw-bold text-[1.5rem] md:absolute! md:top-3 md:right-3">R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}</p>
                                
                                <div className="row m-0 p-0 gap-3 gap-md-0">
                                    <div className="col-12 col-md-6">
                                        <div className="d-flex gap-2">
                                            {/* Círculo que mostra a cor dinamicamente */}
                                            {produto.cores?.map(cor => (
                                                <div 
                                                    key={cor.id}
                                                    className="d-flex flex-column align-items-center cursor-pointer"
                                                    onClick={() => handleChange("cor", cor.hex)}
                                                >
                                                    <div 
                                                        className={`
                                                            transition-all duration-200 ease-in-out
                                                            ${formValue.cor === cor.hex ? 'scale-110 opacity-100 shadow-sm' : 'scale-90 opacity-60 hover:opacity-100 hover:scale-100'}
                                                        `}
                                                        style={{
                                                            backgroundColor: cor.hex, 
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            marginBottom: '5px',
                                                            border: cor.hex === '#FFFFFF' ? '1px solid #ccc' : 'none'
                                                        }} 
                                                        />
                                                    <span className="text-muted" style={{ fontSize: '10px', fontWeight: formValue.cor === cor.hex ? 'bold' : 'normal', textAlign: 'center', lineHeight: '1.1' }}>
                                                        {cor.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="flex gap-2 md:justify-end">
                                            {produto.tamanho?.map(tamanho => (
                                                <div 
                                                    onClick={() => handleChange("tamanho", tamanho)}
                                                    className={`
                                                        d-flex flex-column align-items-center justify-content-center
                                                        w-[2.3rem] h-[2.3rem]
                                                        rounded-circle cursor-pointer
                                                        transition-all duration-200 ease-in-out
                                                        ${formValue.tamanho === tamanho ? 'bg-[#9e9e9e] text-white scale-105 shadow-sm' : 'bg-[#e1e1e1] text-dark hover:bg-[#c1c1c1] opacity-50 hover:opacity-100'}
                                                    `} 
                                                    key={tamanho}>
                                                    <span className="fw-semibold text-[0.7rem]">{tamanho}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="w-100 p-3 md:absolute! md:bottom-0">
                                <div className="mb-3">
                                    <p className="fw-bold">Quantidade disponível: {produto.quantidade}</p>
                                    <div className="d-flex align-items-center justify-content-between p-1 shadow-sm rounded-full" style={{ backgroundColor: "#e1e1e1" }}>
                                        <button 
                                            className="btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }} 
                                            onClick={() => handleChangeQuantity(produto.id, -1)}
                                            disabled={formValue.quantidade <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="fw-bold fs-6">{formValue.quantidade}</span>
                                        <button 
                                        className={`btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center ${formValue.quantidade >= produto.quantidade ? "disabled" : ""}`}
                                            style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }}
                                            onClick={() => handleChangeQuantity(produto.id, 1)}
                                            disabled={formValue.quantidade >= produto.quantidade}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    className="btn w-100 fw-bold border-0 text-white shadow-sm" 
                                    style={{ backgroundColor: "rgba(147, 51, 179, 1)", borderRadius: "8px" }}
                                    onClick={adicionarAoCarrinho}
                                    disabled={formValue.quantidade <= 0}
                                >
                                    Adicionar ao Carrinho
                                </button> 
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}