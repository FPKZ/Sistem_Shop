import { use, useState } from "react"

export default function Produtos({cadastrarProduto}){
    const [categoria , setCategoria] = useState("")
    const [nota , setNota] = useState("")

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    function handleChange(e){
        const { name, value } = e.target
        if(name === 'categoria') console.log('1')
        setFormValue({
            ...formValue,
            [name]: value,
        })
    }

    function validate(form){
        let newErrors = {};
        
        const elements = form.querySelectorAll("[name]")
        
        elements.forEach((e) => {
            const { name, value, required, type } = e

            if(required && !value.trim()){
                newErrors[name] = "Campo obrigatório!"
            }
            
            if (type == "number" && value && isNaN(value)){
                newErrors[name] = "Digite um valor numerico valido"
            }
        })
        return newErrors
    }


    function handleSubimit(e){
        e.preventDefault()
        const form = e.target;

        const newErrors = validate(form)
        setErros(newErrors)
        setValidated(true)
        //console.log(erros)
        //console.log(validated)

        if(Object.keys(newErrors).length === 0){
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())
            //console.log(data)
            data.img = "teste"
            cadastrarProduto(data)
        }
    }

    return (
        <div className="row-cols-2 w-100 p-3 d-flex gap-4">
            <form onSubmit={handleSubimit} noValidate className="row-cols-1 w-100 ">
                <div className="row gap-4 mb-3 pb-4 border-bottom m-0">
                    <div className="col-md-12 w-100 p-0">
                        <label htmlFor="nomeProduto" className="form-label">Nome Do Produto</label>
                        <input className={`form-control ${validated ? (erros.nome ? "is-invalid" : "is-valid") : ""}`} name="nome" id="nomeProduto" type="text" placeholder="nome" onChange={handleChange} required/>
                    </div>
                    <div className="col-md-4 p-0">
                        <label htmlFor="imgProduto" className="form-label">Imagem do Produto</label>
                        <input className={`form-control ${validated ? (erros.img ? "is-invalid" : "is-valid") : ""}`} name="img" id="imgProduto" type="file" required/>
                    </div>
                    <div className="col-md-2 p-0">
                        <label htmlFor="corProduto" className="form-label">Cor do Produto</label>
                        <input className="form-control form-control-color" name="cor" id="corProduto" type="color" placeholder="Cor" />
                    </div>
                    <div className="col-md p-0">
                        <label htmlFor="tamanhoProduto" className="form-label">Tamanho do Produto</label>
                        <input className={`form-control ${validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""}`} name="tamanho" id="tamanhoProduto" type="number" placeholder="Tamanho" required />
                    </div>
                    <div className="col-md p-0 d-flex flex-column">
                        <label htmlFor="categoriaProduto" className="form-label">Categoria do Produto</label>
                        <div className="btn-group">
                            <button type="button" className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${validated ? (erros.categoria ? "is-invalid" : "is-valid") : ""}`} data-bs-toggle="dropdown" aria-expanded="false">{categoria || "Selecione a Categoria"}</button>
                            <input className={`form-control `} id="categoriaProduto" type="hidden" name="categoria" value={categoria} required/>
                            <ul className="dropdown-menu w-100">
                                <li><a className="dropdown-item" href="#" onClick={() => setCategoria("cat")}>cat</a></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">Nova Categoria</a></li>
                            </ul>
                        </div>
                    </div>
                    {/* <div class="col-md-4">
                        <label for="inputState" class="form-label">State</label>
                        <select id="inputState" class="form-select">
                        <option selected>Choose...</option>
                        <option><hr></hr></option>
                        <option>...</option>
                        </select>
                    </div> */}
                </div>
                <div className="row gap-5  m-0 pb-4 mb-3 border-bottom">
                    <div className="col-md-2 d-flex flex-column p-0 m-0">
                        <label htmlFor="notaProduto" className="form-label">Nota do Produto</label>
                        <div className="dropdown-center">
                            <button type="button" className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${validated ? (erros.categoria ? "is-invalid" : "is-valid") : ""}`} data-bs-toggle="dropdown" aria-expanded="false">{nota || "Selecione a Nota"}</button>
                            <input className={`form-control ${validated ? (erros.notaProduto ? "is-invalid" : "is-valid") : ""}`} id="notaProduto" type="hidden" name="nota" value={nota} onChange={handleChange} required/>
                            <ul className="dropdown-menu w-100">
                                <li><a className="dropdown-item" href="#" onClick={() => setNota("cat")}>cat</a></li>
                                <li><a className="dropdown-item" href="#">dasd</a></li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">Nova Categoria</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md p-0 m-0">
                        <label htmlFor="valorCompraProduto" className="form-label">Valor de Compra</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className={`form-control ${validated ? (erros.valor_compra ? "is-invalid" : "is-valid") : ""}`} name="valor_compra" id="valorCompraProduto" type="text" placeholder="0.00" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="col-md p-0 m-0">
                        <label htmlFor="valorVendaProduto" className="form-label">Valor de Venda</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className={`form-control ${validated ? (erros.valor_venda ? "is-invalid" : "is-valid") : ""}`} name="valor_venda" id="valorVendaProduto" type="text" placeholder="0.00" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="col-md p-0 m-0">
                        <label htmlFor="LucroProduto" className="form-label">Lucro</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input className={`form-control ${validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""}`} name="lucro" id="LucroProduto" type="number" placeholder="lucro" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="col-md-2 p-0 m-0">
                        <label htmlFor="entradaEstoqueProduto" className="form-label">Entrada do Produto</label>
                        <input className={`form-control ${validated ? (erros.entrada_estoque ? "is-invalid" : "is-valid") : ""}`} name="entrada_estoque" id="entradaEstoqueProduto" type="number" placeholder="Quantidade" onChange={handleChange} required/>
                    </div>
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="descricaoProduto" className="form-label">Descrição do Produto</label>
                    <input className={`form-control ${validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""}`} name="descricao" type="text" id="descricaoProduto" placeholder="Descrição" onChange={handleChange} required/>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-roxo w-100" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    )
}