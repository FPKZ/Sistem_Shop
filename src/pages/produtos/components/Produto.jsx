import util from "../../../app/utils.js"

function Produto({produtos, setModalInfoProduto, setProduto, mobile}) {
    if(!produtos || produtos.length === 0) return (
        <div className="alert alert-roxo mt-4" role="alert" >
            Nenhum produto cadastrado!
        </div>
    )
    const getEstoqueBadge = (estoque) => {
        const quantidade = estoque || 0;
        if (quantidade >= 10) {
        // Estoque alto: verde
        return <span className="badge bg-success">Estoque Alto</span>;
        } else if (quantidade >= 5) {
        // Estoque médio: amarelo
        return <span className="badge bg-warning text-dark">Estoque Médio</span>;
        } else if (quantidade > 0) {
        // Estoque baixo: laranja
        return <span className="badge bg-danger">Estoque Baixo</span>;
        } else {
        // Fora de estoque: cinza
        return <span className="badge bg-secondary">Fora de Estoque</span>;
        }
    };
    //console.log(produtos)
    return (
        <>
            {/* <div>
                <h4 className="mb-3">Total de Produtos: {produtos.length}</h4>
                <hr />
                <p className="text-muted">Gerencie seus produtos com facilidade.</p>
                <button className="btn btn-roxo">Adicionar Produto</button>
                <button className="btn btn-secondary ms-2">Exportar Lista</button>
                <button className="btn btn-secondary ms-2">Filtrar Produtos</button>
            </div> */}
            <div className="my-4 row d-flex flex-wrap gap-md-0 gap-sm-2 gap-2 p-0">
                <div className="col-md-8 col-sm-12">
                    <input type="text" className="form-control h-100" placeholder="Buscar produtos..." />
                </div>
                <div className="col-md-4 col-sm-12 d-flex gap-3">
                    <button className="btn btn-secondary w-50">Buscar</button>
                    <button className="btn btn-secondary w-50">Limpar Filtros</button>
                </div>
            </div>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 align-items-stretch h-100 g-4 mb-4">
                {
                    produtos.map(produto => (
                        <div className="col" key={produto.id}  onClick={() => {setModalInfoProduto(true); setProduto(produto)}}>
                            <div className="card h-100 shadow-sm " style={{minHeight: "297px"}}>
                                <img 
                                    className="card-img-top img-fluid"
                                    src={!produto.img ? `${import.meta.env.VITE_DATABASE_IMG}/uploads/${produto.img}` : "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"} 
                                    alt={produto.nome}
                                    
                                />
                                <div className="card-body p-2">
                                    <h5 className="card-title">{produto.nome}</h5>
                                    <p className="card-text text-muted small">{util.capitalize(produto.descricao, 50)}</p>
                                </div>
                                <div className="card-footer bg-transparent row border-top-0 d-flex justify-content-between align-items-center p-2">
                                    <div className={`col-6 d-flex flex-wrap gap-1 justify-content-start align-items-end`}>
                                        <span className="fw-bold fs-5">{produto.itemEstoque.length || `0`}</span>
                                        <span className="text-muted small"> unidades</span>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end align-items-center h-100">
                                        {getEstoqueBadge(produto.itemEstoque.length)}
                                    </div>
                                </div>
                                {/* <div className="card-footer d-flex justify-content-end p-2">
                                    <button className="btn btn-outline-secondary btn-sm " onClick={() => {setModalInfoProduto(true); setProduto(produto)}}>
                                        <i className="bi bi-three-dots"></i> Mais
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
                            // <div key={produto.id} onClick={() => deleteProduto(produto.id)} className="container bg-danger">
                            //     <ul>
                            //         <li>{produto.nome}</li>
                            //         <li>{produto.descricao}</li>
                            //         <li>{produto.tamanho}</li>
                            //         <li>{produto.cor}</li>
                            //         <li>{produto.img}</li>
                            //         <li>{produto.valor_venda}</li>
                            //         <li>{produto.valor_compra}</li>
                            //         <li>{produto.estoque_atual}</li>
                            //         <li>{produto.codigo_barras}</li>
                            //         <li>{produto.categoria_id}</li>
                            //     </ul>
                            // </div>

export default Produto