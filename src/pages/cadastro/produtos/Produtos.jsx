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
        <div className="">
            <form onSubmit={handleSubimit}>
                <div>
                    <label for="nomeProduto" className="form-label">Nome Do Produto</label>
                    <input className="form-control" name="nome" id="nomeProduto" type="text" placeholder="nome" required/>
                    <label for="imgProduto" className="form-label">Imagem do Produto</label>
                    <input className="form-control" name="img" id="imgProduto" type="file" />
                    <label for="corProduto" className="form-label">Cor do Produto</label>
                    <input className="form-control form-control-color" name="cor" id="corProduto" type="color" placeholder="Cor" value=" "/>
                    <label for="tamanhoProduto" className="form-label">Tamanho do Produto</label>
                    <input className="form-control" name="tamanho" id="tamanhoProduto" type="text" placeholder="Tamanho" />
                    <label for="categoriaProduto" className="form-label">Categoria do Produto</label>
                    <div className="btn-group">
                        <button type="button" className="dropdown-toggle " data-bs-toggle="dropdown" aria-expanded="false">{categoria}</button>
                        <input className="form-control" type="hidden" name="categoria" value={categoria} />
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => setCategoria("cat")}>cat</a></li>
                            <li><a className="dropdown-item" href="#">dasd</a></li>
                            <li><hr class="dropdown-divider"></hr></li>
                            <li><a className="dropdown-item" href="#">dasd</a></li>
                        </ul>
                    </div>
                </div>
                <div>
                    <label for="notaProduto" className="form-label">Nota do Produto</label>
                    <div className="btn-group">
                        <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{nota}</button>
                        <input className="form-control" type="hidden" name="categoria" value={nota} required/>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => setCategoria("cat")}>cat</a></li>
                            <li><a className="dropdown-item" href="#">dasd</a></li>
                            <li><hr class="dropdown-divider"></hr></li>
                            <li><a className="dropdown-item" href="#">dasd</a></li>
                        </ul>
                    </div>
                    <label for="valorCompraProduto" className="form-label">Valor de Compra</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input className="form-control" name="valor_compra" id="valorCompraProduto" type="text" placeholder="valor de compra" required/>
                        <span class="input-group">0.00</span>
                    </div>
                    <label for="valorVendaProduto" className="form-label">Valor de Venda</label>
                    <input className="form-control" name="valor_venda" id="valorVendaProduto" type="text" placeholder="valor de venda" required/>
                    <label for="LucroProduto" className="form-label">Lucro</label>
                    <input className="form-control" name="lucro" id="LucroProduto" type="number" placeholder="lucro" required/>
                    <label for="entradaEstoqueProduto" className="form-label">Entrada do Produto</label>
                    <input className="form-control" name="entrada_estoque" id="entradaEstoqueProduto" type="text" placeholder="quantidade de entrada" required/>
                </div>
                <div>
                    <label for="descricaoProduto" className="form-label">Descrição do Produto</label>
                    <input className="form-control" name="descricao" type="text" id="descricaoProduto" placeholder="Descrição"/>
                </div>
                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}