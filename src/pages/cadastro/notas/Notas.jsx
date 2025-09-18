import { Modal, Row, Col, Button, Card, Form, Alert, Container, Table, Badge, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react"
import TabelaProdutos from "../../../components/modal/Tabelas/TabelaProduto";

export default function Notas(){
    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const [mobile, setMobile] = useState( window.innerWidth < 900)

    const [itemEstoque, setItemEstoque] = useState()
    const [produtos, setProdutos ] = useState()

    useEffect(() => {
        const handleResize = () => {
           setMobile(window.innerWidth < 900)
        }
        setProdutos({
            id: 8,
            nome: "algema",
            img: "teste",
            descricao: "wsadaSDASD",
            createdAt: "2025-09-15T22:04:54.955Z",
            updatedAt: "2025-09-15T22:04:54.955Z",
            categoria_id: 3,
            categoria: {
                id: 3,
                nome: "Acessorios",
                descricao: "asdasad",
                createdAt: "2025-09-15T14:32:55.040Z",
                updatedAt: "2025-09-15T14:32:55.040Z"
            },
            itemEstoque: [
                {
                    id: 9,
                    nome: "algema",
                    tamanho: "21",
                    cor: "#a3a3a3",
                    marca: "gal",
                    codigo_barras: "1231243124124124124124",
                    valor_compra: 123,
                    valor_venda: 12,
                    lucro: 12,
                    status: "Disponivel",
                    createdAt: "2025-09-15T22:04:55.025Z",
                    updatedAt: "2025-09-15T22:04:55.025Z",
                    produto_id: 8,
                    nota_id: 1,
                    nota: {
                        id: 1,
                        codigo: "52346",
                        quantidade: 15,
                        valor_total: 150.5,
                        data: "2025-09-11T23:39:19.585Z",
                        createdAt: "2025-09-15T13:31:23.756Z",
                        updatedAt: "2025-09-15T13:31:23.756Z"
                    }
                },
                {
                    id: 10,
                    nome: "algema",
                    tamanho: "21",
                    cor: "#a3a3a3",
                    marca: "gal",
                    codigo_barras: "1231243124124124124124",
                    valor_compra: 123,
                    valor_venda: 12,
                    lucro: 12,
                    status: "Disponivel",
                    createdAt: "2025-09-15T22:05:10.892Z",
                    updatedAt: "2025-09-15T22:05:10.892Z",
                    produto_id: 8,
                    nota_id: 1,
                    nota: {
                        id: 1,
                        codigo: "52346",
                        quantidade: 15,
                        valor_total: 150.5,
                        data: "2025-09-11T23:39:19.585Z",
                        createdAt: "2025-09-15T13:31:23.756Z",
                        updatedAt: "2025-09-15T13:31:23.756Z"
                    }
                }
            ]
        })
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    },[])

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
            console.log(data)
            //cadastrarProduto(data_refatorada)
        }
    }
    console.log(produtos)
    return(
        <div className="row-col w-100 p-3 d-flex gap-4 justify-content-center">
            <form onSubmit={handleSubimit} noValidate className="row d-flex flex-wrap w-100 gap-3">
                <div className="col-sm col-md-12 p-0">
                    <label htmlFor="numeroNota"  className="form-label">Numero da Nota</label>
                    <input type="text" className={`form-control ${validated ? (erros.codigo ? `is-invalid` : `is-valid`): ""}`} name="codigo" id="numeroNota" onChange={handleChange} required/>
                </div>
                <div className="col-sm col-md-2 p-0">
                    <label htmlFor="valor_total" className="form-label">Valor da Nota</label>
                    <input type="number" className={`form-control ${validated ? (erros.valor_total ? `is-invalid` : `is-valid`): ""}`} name="valor_total" id="valor_total" onChange={handleChange} required/>
                </div>
                <div className="col-sm col-md-2 p-0">
                    <label htmlFor="data" className="form-label">Data da nota</label>
                    <input type="date" className={`form-control ${validated ? (erros.data ? `is-invalid` : `is-valid`): ""}`} name="data" id="data" onChange={handleChange} required/>
                </div>
                <div className="col-sm col-md-3 p-0">
                    <label htmlFor="quantidade" className="form-label">Quantidade de produtos da nota</label>
                    <input type="number" className={`form-control ${validated ? (erros.quantidade ? `is-invalid` : `is-valid`): ""}`} name="quantidade" id="quantidade" onChange={handleChange} required/>
                </div>
                <div className="col-12 form-control d-flex flex-wrap mt-4 p-0" style={{height:  '400px'}}>
                    <div className="col-12 d-flex justify-content-between p-2 border-bottom">
                        <p className="align-content-center m-0">Produtos</p>
                        <button className="btn btn-light" type="button">Adicionar Produto</button>
                    </div>
                    <div className="col-12 d-flex flex-column gap-2 overflow-y-auto flex-grow-1" style={{height: "86%"}}>
                        <TabelaProdutos mobile={mobile} produto={produtos} setItemEstoque={setItemEstoque}/>
                    </div>
                </div>
                <button className="btn btn-roxo" type="submit">Adicionar</button>
            </form>
        </div>
    )
}

