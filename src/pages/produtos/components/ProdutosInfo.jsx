import { useState, useEffect, use } from "react"

export default function ProdutoInfo({visible, onClose, produto}){
    const [ itemEstoque, setItemEstoque ] = useState({})

    useEffect(() => {
        setItemEstoque({})
    }, [produto])
    
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
                            <Produtos produtos={produto} setItemEstoque={setItemEstoque} />

                        </div>
                    </div>
                    <div className="col-md-6 p-0 h-100">
                        <div className="form-control h-100">
                            <div className="d-flex flex-column p-1 justify-content-center align-items-center">
                                <h3 className="mb-3">{produto.nome}</h3>
                            </div>
                            <div className="d-flex flex-column flex-md-row h-25 m-3">
                                <img className="img-thumbnail rounded mx-auto d-block" src={"src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg" || produto.img} alt={produto.nome} />
                            </div>
                            <div className="d-flex flex-column p-2">
                                <h4 className="mb-3">Detalhes do Produto</h4>
                                {
                                    itemEstoque.id ? <></> : <div className="alert alert-warning" role="alert">
                                        Selecione um item de estoque para ver os detalhes.
                                    </div>
                                }
                                {
                                    itemEstoque.id && (
                                        <>
                                            <div className="mb-3">
                                                <strong>Nome:</strong> {itemEstoque.nome}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Descrição:</strong> {produto.descricao}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Marca:</strong> {itemEstoque.marca}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Cor:</strong> <input type="color" name="" id="" value={itemEstoque.cor} onChange={(e) => setItemEstoque({...itemEstoque, cor: e.target.value})} />
                                            </div>
                                            <div className="mb-3">
                                                <strong>Tamanho:</strong> {itemEstoque.tamanho}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Preço de Venda:</strong> {itemEstoque.valor_venda}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Preço de Compra:</strong> {itemEstoque.valor_compra}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Lucro:</strong> {itemEstoque.lucro ? `${itemEstoque.lucro}%` : '0%'}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Categoria:</strong> {produto.categoria.nome}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Status:</strong> {itemEstoque.status}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Código de barras:</strong> {itemEstoque.codigo_barras}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Nota:</strong> {itemEstoque.nota ? itemEstoque.nota.codigo : 'Nenhuma nota associada'}
                                            </div>
                                            <div className="mt-auto d-flex justify-content-end gap-2">
                                                <button className="btn btn-primary" onClick={() => {}}>Editar</button>
                                                <button className="btn btn-danger" onClick={() => {}}>Excluir</button>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>

    )
}

function Produtos({produtos, setItemEstoque}){
    //console.log(produtos)
    const itens = produtos.itemEstoque
    return(
        <>
        {
            itens.map(produto => (
                <div key={produto.id} className="card col-12 d-flex flex-wrap justify-content-around align-content-start gap-1" style={{maxHeight: "120px", cursor: "pointer"}} onClick={() => setItemEstoque(produto)}>
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