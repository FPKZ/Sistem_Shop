import { useState } from "react"

export default function Produtos(){
    const [categoria , setCategoria] = useState("Selecione a categoria")
    const [nota , setNota] = useState("Selecione a nota")
    function handleSubimit(e){
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
    }
    return (
        <div className="row row-cols-2 w-100 p-3 d-flex gap-4">
            <form onSubmit={handleSubimit} className="row-cols-1 w-100">
                <div className="row">
                    <div className="col-md-12">
                        <label htmlFor="nomeProduto" className="form-label">Nome Do Produto</label>
                        <input className="form-control" name="nome" id="nomeProduto" type="text" placeholder="nome" required/>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="imgProduto" className="form-label">Imagem do Produto</label>
                        <input className="form-control" name="img" id="imgProduto" type="file" />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="corProduto" className="form-label">Cor do Produto</label>
                        <input className="form-control form-control-color" name="cor" id="corProduto" type="color" placeholder="Cor" />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="tamanhoProduto" className="form-label">Tamanho do Produto</label>
                        <input className="form-control" name="tamanho" id="tamanhoProduto" type="text" placeholder="Tamanho" />
                    </div>
                    <div className="col-md-4 d-flex flex-column">
                        <label htmlFor="categoriaProduto" className="form-label">Categoria do Produto</label>
                        <div className="btn-group">
                            <button type="button" className="dropdown-toggle " data-bs-toggle="dropdown" aria-expanded="false">{categoria}</button>
                            <input className="form-control" id="categoriaProduto" type="hidden" name="categoria" value={categoria} />
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" onClick={() => setCategoria("cat")}>cat</a></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 d-flex flex-column">
                        <label htmlFor="notaProduto" className="form-label">Nota do Produto</label>
                        <div className="btn-group">
                            <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{nota}</button>
                            <input className="form-control" id="notaProduto" type="hidden" name="categoria" value={nota} required/>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#" onClick={() => setCategoria("cat")}>cat</a></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="valorCompraProduto" className="form-label">Valor de Compra</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className="form-control" name="valor_compra" id="valorCompraProduto" type="text" placeholder="0.00" required/>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="valorVendaProduto" className="form-label">Valor de Venda</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className="form-control" name="valor_venda" id="valorVendaProduto" type="text" placeholder="valor de venda" required/>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="LucroProduto" className="form-label">Lucro</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className="form-control" name="lucro" id="LucroProduto" type="number" placeholder="lucro" required/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="entradaEstoqueProduto" className="form-label">Entrada do Produto</label>
                        <input className="form-control" name="entrada_estoque" id="entradaEstoqueProduto" type="text" placeholder="quantidade de entrada" required/>
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="descricaoProduto" className="form-label">Descrição do Produto</label>
                    <input className="form-control" name="descricao" type="text" id="descricaoProduto" placeholder="Descrição"/>
                </div>
                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}