function Produto({produtos, deleteProduto}) {
    if(!produtos || produtos.length === 0) return (
        <div className="alert alert-info mt-4" role="alert">
            Nenhum produto cadastrado!
        </div>
    )
    const getEstoqueBadge = (estoque) => {
        const quantidade = estoque || 0;
        if (quantidade > 20) {
        // Estoque alto: verde
        return <span className="badge bg-success">Estoque Alto</span>;
        } else if (quantidade > 5) {
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
    console.log(produtos)
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 mb-4">
            {
                produtos.map(produto => (
                    <div className="col" key={produto.id}>
                        <div className="card h-100 shadow-sm">
                            <img 
                                className="card-img-top"
                                src={/*produto.img*/ "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"} 
                                alt={produto.nome}
                                style={{objectFit: `cover`, height: `200px`}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{produto.nome}</h5>
                                <p className="card-text text-muted small">{produto.descricao}</p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold fs-5">{produto.estoque_atual || `0`}</span>
                                    <span className="text-muted small"> unidades</span>
                                </div>
                                {getEstoqueBadge(produto.estoque_atual)}
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-outline-secondary btn-sm me-2">
                                    <i className="bi bi-pencil-square"></i> Editar
                                </button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProduto(produto.id)}>
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
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