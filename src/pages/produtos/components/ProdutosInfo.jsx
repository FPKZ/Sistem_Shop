

export default function ProdutoInfo({visible, onClose, produto}){
    if(!visible) return null
    console.log(produto)
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box w-100 h-100 position-relative p-0" onClick={e => e.stopPropagation()}>
                <div className="btn-close position-absolute end-0 top-0 px-2 m-2 fs-4" style={{cursor: "pointer"}} onClick={onClose}>
                    {/* <i className="bi bi-x-square-fill fs-2"></i> */}
                </div>
                <div className="row w-100 h-100 m-0 p-2">
                    <div className="col-md-6 p-0 h-100">
                        <div className="card h-100 p-1 gap-1 overflow-y-auto">
                            <Produtos produtos={produto} />

                        </div>
                    </div>
                    <div className="col-md-6 p-0 h-100">
                        <div className="form-control h-100">

                        </div>
                    </div>
                </div>
            </div>    
        </div>

    )
}

function Produtos({produtos}){
    console.log(produtos)
    const itens = produtos.itemEstoque
    return(
        <>
        {
            itens.map(produto => (
                <div className="card col-12 d-flex flex-wrap justify-content-around align-content-start gap-1" style={{maxHeight: "120px"}}>
                    <img className="col-1 p-1 m-0" src="src\assets\la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg" alt="" />
                    <h1 className="col-3 h-100 h4 m-0 align-content-center">{produto.nome}</h1>
                    <div className="col-1 card-text m-0 h-100 align-content-center">{produto.marca}</div>
                    <div className="col-1 card-text h-100 align-content-center">{produtos.categoria.nome}</div>
                    <div className="col-1 card-text h-100 align-content-center">{produto.valor_compra}</div>
                    <div className="col-1 card-text h-100 align-content-center">{produto.valor_venda}</div>
                    <div className="col-1 position-absolute end-0 d-flex flex-column gap-2 p-1">
                        <button className="btn btn-outline-danger" type="button"><i className="bi bi-trash3"></i></button>
                        <button className="btn btn-outline-secondary" type="button"><i className="bi bi-three-dots"></i></button>
                    </div>
                </div>

            ))
        }
        </>
    )
}