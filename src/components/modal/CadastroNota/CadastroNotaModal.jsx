import { Form, Modal, Card, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react"
import TabelaProdutos from "@components/modal/Tabelas/TabelaProduto";
import CadastroModal from "@components/modal/CadastroProdutos/CadastroIntenModal";
import ProdutoInfo from "@components/modal/InfoProdutos/InfoProdutos";


export default function CadastroNotaModal({visible, onClose, produts = true, fullScrean = false}){

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const [mobile, setMobile] = useState( window.innerWidth < 900)

    const [itemEstoque, setItemEstoque] = useState({})
    const [produtos, setProdutos ] = useState([])

    const [modalCadastroPrduto, setmodalCadastroPrduto ] = useState(false)
    const [modalInfoProduto, setmodalInfoProduto ] = useState(false)


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
                    nome: "algemaaaaaa",
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

    function cadastrarProduto(data){
        console.log(data)
        const p = produtos.concat(data)
        setProdutos(p)
    }

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

    function FormatData(data){
        const formData = new FormData(data)
        const dataf = Object.fromEntries(formData.entries())
        return dataf
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
            const data_refatorada = FormatData(e.target)
            console.log(data_refatorada)
            //cadastrarProduto(data_refatorada)
        }
    }

    return (
        <>
        <Modal show={visible} onHide={onClose} fullscreen={`${fullScrean && "sm-down"}`}>
            <Form onSubmit={handleSubimit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cadastrar Nota
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-2">
                        <Col xs={12} md={12}>
                            <label htmlFor="numeroNota"  className="form-label">Numero da Nota</label>
                            <input type="text" className={`form-control ${validated ? (erros.codigo ? `is-invalid` : `is-valid`): ""}`} name="codigo" id="numeroNota" onChange={handleChange} required/>
                        </Col>
                        <Col xs={4} md={2}>
                            <label htmlFor="valor_total" className="form-label">Valor da Nota</label>
                            <input type="number" className={`form-control ${validated ? (erros.valor_total ? `is-invalid` : `is-valid`): ""}`} name="valor_total" id="valor_total" onChange={handleChange} required/>
                        </Col>
                        <Col xs={4} md={3}>
                            <label htmlFor="data" className="form-label">Data da nota</label>
                            <input type="date" className={`form-control ${validated ? (erros.data ? `is-invalid` : `is-valid`): ""}`} name="data" id="data" onChange={handleChange} required/>
                        </Col>
                        <Col xs={4}>
                            <label htmlFor="fornecedor" className="form-label">Fornecedor</label>
                            <input type="text" className={`form-control ${validated ? (erros.fornecedor ? `is-invalid` : `is-valid`): ""}`} name="fornecedor" id="fornecedor" onChange={handleChange} required/>
                        </Col>
                        <Col xs={3} >
                            <label htmlFor="quantidade" className="form-label">Quantidade de produtos</label>
                            <input type="number" className={`form-control ${validated ? (erros.quantidade ? `is-invalid` : `is-valid`): ""}`} name="quantidade" id="quantidade" onChange={handleChange} required/>
                        </Col>
                        {produts && (
                            <Col className="col-12 form-control d-flex flex-wrap mt-4 p-0" style={{height:  '400px'}}>
                                <Col className="col-12 d-flex justify-content-between p-2 border-bottom">
                                    <p className="align-content-center m-0">Produtos</p>
                                    <button className="btn btn-light" type="button" onClick={() => setmodalCadastroPrduto(true)}>Adicionar Produto</button>
                                </Col>
                                <Col className="col-12 d-flex flex-column gap-2 overflow-y-auto flex-grow-1" style={{height: "86%"}}>
                                    <TabelaProdutos mobile={mobile} produto={produtos} setItemEstoque={setItemEstoque}  setmodalInfoProduto={setmodalInfoProduto} />
                                </Col>
                            </Col>
                        )}
                        <Col xs={12}>
                            <button className="btn btn-roxo w-100" type="submit">Adicionar</button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Form>
        </Modal>
        <CadastroModal visible={modalCadastroPrduto} onClose={() => setmodalCadastroPrduto(false)} cadastroNota={true} cadastrarProduto={cadastrarProduto}/>
        <ProdutoInfo visible={modalInfoProduto} onClose={() => setmodalInfoProduto(false)} tableShow={false} produto={itemEstoque}/>
        </>
    )
}