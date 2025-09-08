export default function Produtos(){
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
                <input name="nome" type="text" placeholder="nome" required/>
                <input name="img" type="image" id="" />
                <input name="cor" type="text" placeholder="Cor" />
                <input name="tamanho" type="text" placeholder="Tamanho" />
                <h3>categoria</h3>
            </div>
            <div>
                <h3>nota</h3>
                <input name="valor_compra" type="text" placeholder="valor de compra" required/>
                <input name="valor_venda" type="text" placeholder="valor de venda" required/>
                <input name="lucro" type="number" placeholder="lucro" required/>
                <input name="entrada_estoque" type="text" placeholder="quantidade de entrada" required/>
            </div>
            <div>
                <input name="descricao" type="text" id="" placeholder="Descrição"/>
            </div>
            <button type="submit">Salvar</button>
            </form>
        </div>
    )
}