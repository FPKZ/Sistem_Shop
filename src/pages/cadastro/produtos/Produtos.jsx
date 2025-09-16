import { useEffect, useState } from "react"
import API from "../../../components/app/api.js"

export default function Produtos({cadastrarProduto}){
    const [categoria , setCategoria] = useState({})
    const [nota , setNota] = useState({})
    const [notas, setNotas] = useState([])
    const [categorias, setCategorias] = useState([])

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


    async function handleSubimit(e){
        e.preventDefault()
        const form = e.target;

        const newErrors = validate(form)
        setErros(newErrors)
        setValidated(true)
        //console.log(erros)
        //console.log(validated)

        if(Object.keys(newErrors).length === 0){
            const formData = new FormData()
            const formElements = e.target.elements

            for ( const element of formElements ) {
                if( element.name ) {
                    if ( element.type === "file") {
                        if ( element.files[0] ) {
                            formData.append(element.name, element.files[0])
                        }
                    } else {
                        formData.append(element.name, element.value)
                    }
                }
            }
            const itens = [{
                codigo_barras: formData.get("codigo_barras"),
                nota_id: formData.get("nota"),
                tamanho: formData.get("tamanho"),
                cor: formData.get("cor"),
                marca: formData.get("marca"),
                valor_compra: formData.get("valor_compra"),
                valor_venda: formData.get("valor_venda"),
                lucro: formData.get("lucro")
            }]
            formData.set("itens", JSON.stringify(itens))

            ['codigo_barras', 'nota', 'tamanho', 'cor', 'marca', 'valor_compra', 'valor_venda', 'lucro'].forEach(field => {
                formData.delete(field)
            })

            console.log(formData)
            //cadastrarProduto(formData)
        }
    }

    useEffect(() => {
        GetNotas()
        GetCategorias()
    }, [])

    const GetCategorias = async () => {
        const categorias = await API.getCategoria()
        //console.log(categorias)
        setCategorias(categorias)
    }
    const GetNotas = async () => {
        const notas = await API.getNotas()
        setNotas(notas)
    }

    return (
        <div className="row-cols-2 w-100 p-3 d-flex gap-4">
            <form onSubmit={handleSubimit} noValidate className="row-cols-1 w-100 ">
                <div className="row gap-4 mb-3 pb-4 border-bottom m-0">
                    <div className="col-md-12 w-100 p-0">
                        <label htmlFor="nomeProduto" className="form-label">Nome</label>
                        <input className={`form-control ${validated ? (erros.nome ? "is-invalid" : "is-valid") : ""}`} name="nome" id="nomeProduto" type="text" placeholder="nome" onChange={handleChange} required/>
                    </div>
                    <div className="col-md-4 p-0">
                        <label htmlFor="imgProduto" className="form-label">Imagem</label>
                        <input className={`form-control ${validated ? (erros.img ? "is-invalid" : "is-valid") : ""}`} name="img" id="imgProduto" type="file" required/>
                    </div>
                    <div className="col-md-1 p-0">
                        <label htmlFor="corProduto" className="form-label">Cor</label>
                        <input className="form-control form-control-color" name="cor" id="corProduto" type="color" placeholder="Cor" />
                    </div>
                    <div className="col-md-2 p-0">
                        <label htmlFor="marcaProduto" className="form-label">Marca</label>
                        <input className={`form-control ${validated ? (erros.marca ? "is-invalid" : "is-valid") : ""}`} name="marca" id="marcaProduto" type="text" placeholder="Marca" required />
                    </div>
                    <div className="col-md p-0 d-flex flex-column">
                        <label htmlFor="categoriaProduto" className="form-label">Categoria</label>
                        <div className="btn-group">
                            <button type="button" className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${validated ? (erros.categoria ? "is-invalid" : "is-valid") : ""}`} data-bs-toggle="dropdown" aria-expanded="false">{categoria.nome || "Selecione a Categoria"}</button>
                            <input className={`form-control `} id="categoriaProduto" type="hidden" name="categoria" value={categoria.id || ""} required/>
                            <ul className="dropdown-menu w-100">
                                <Categoria categorias={categorias} setCategoria={setCategoria} />
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">Nova Categoria</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md p-0">
                        <label htmlFor="tamanhoProduto" className="form-label">Tamanho</label>
                        <input className={`form-control ${validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""}`} name="tamanho" id="tamanhoProduto" type="number" placeholder="Tamanho" required />
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
                    <div className="col-md-4 d-flex flex-column p-0 m-0">
                        <label htmlFor="notaProduto" className="form-label">Nota</label>
                        <div className="dropdown-center">
                            <button type="button" className={`dropdown-toggle form-control d-flex justify-content-between align-items-center ${validated ? (erros.nota ? "is-invalid" : "is-valid") : ""}`} data-bs-toggle="dropdown" aria-expanded="false">{nota.codigo || "Selecione a Nota"}</button>
                            <input className={`form-control ${validated ? (erros.notaProduto ? "is-invalid" : "is-valid") : ""}`} id="notaProduto" type="hidden" name="nota" value={nota.id || ""} onChange={handleChange} required/>
                            <ul className="dropdown-menu w-100">
                                <Nota notas={notas} setNota={setNota} />
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">Nova Categoria</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-5 p-0">
                        <label htmlFor="codigoBarras" className="form-label">Codigo de Barras</label>
                        <input className={`form-control ${validated ? (erros.codigo_barras ? "is-invalid" : "is-valid") : ""}`} name="codigo_barras" id="codigoBarras" type="text" placeholder="Codigo de Barras" required />
                    </div>
                    <div className="col-md-2 p-0 m-0">
                        <label htmlFor="entradaEstoqueProduto" className="form-label">Entrada</label>
                        <input className={`form-control ${validated ? (erros.entrada_estoque ? "is-invalid" : "is-valid") : ""}`} name="entrada_estoque" id="entradaEstoqueProduto" type="number" placeholder="Quantidade" onChange={handleChange} required/>
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
                </div>
                <div className="col-md-12 mb-3">
                    <label htmlFor="descricaoProduto" className="form-label">Descrição</label>
                    <input className={`form-control ${validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""}`} name="descricao" type="text" id="descricaoProduto" placeholder="Descrição" onChange={handleChange} required/>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-roxo w-100" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    )
}

function Nota({notas, setNota}){   
    return (
        <>
            {notas.map(nota => (
                 <li key={nota.id}><a className="dropdown-item" href="#" onClick={() => setNota(nota)}>{nota.codigo}</a></li>
            ))}
            </>
        )
}
function Categoria({categorias,  setCategoria}){
    return (
        <>
            {categorias.map(categoria => (
                <li key={categoria.id}><a className="dropdown-item" href="#" onClick={() => setCategoria(categoria)}>{categoria.nome}</a></li>
            ))}
        </>
    )
}