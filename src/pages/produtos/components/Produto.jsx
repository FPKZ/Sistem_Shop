function Produto({produtos, deleteProduto}){
    console.log(produtos)
    if(produtos.length !== 0){
        return (
            <>
                {
                    produtos.map(produto => {
    
                        return (
                            <div key={produto.id} onClick={() => deleteProduto(produto.id)} className="container bg-danger">
                                <ul>
                                    <li>{produto.titulo}</li>
                                </ul>
                            </div>
    
                        )
                    })
                }
            </>
        )
    }


}

export default Produto