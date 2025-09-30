import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados"
import Produtos from "./produtos/Produtos";
import Clientes from "./clientes/Clientes";
import Notas from "./notas/Notas";
import API from "../../app/api.js"


function Cadastro() {
  const [tela, setTela] = useState()
  const [itensCriados,  setItensCriados] = useState([])
  const [modalCriar, setModalCriar] = useState(false)
  //const navigate = useNavigate()
  



  const cadastrarProduto = async (data) => {
    try {
      const response = await API.postProduto(data);
      setItensCriados(response.itensEstoque)
      return response
    } catch (error){
      console.error("erro ao cadastar" , error)
    }
  }
  console.log(itensCriados)
  return (
    <div className="p-2 p-md-4">
      <div className="d-flex justify-content-start flex-wrap flex-md-nowarp align-items-start pt-3 pb-1 mb-3 gap-2 border-bottom">
        {tela && (
          <button className="btn btn-roxo" onClick={() => /*navigate(-1)*/ setTela("")}>
            <i className="bi bi-chevron-left"></i>
          </button>
        )}
        <nav className="d-flex justify-content-center align-items-center" style={{'--bs-breadcrumb-divider': `url('/assets/chevron-right.svg')`}} aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><h1 className="h2">Cadastrar</h1></li>
            {tela && (
              <h1 className="h2 breadcrumb-item">{tela}</h1>
            )}

          </ol>
        </nav>

      </div>
      <div className="row row-cols-* g-2 g-md-4">
        {
          !tela && (
            <>
              <Card icon="grid-fill" setTela={() => {setTela("Produtos")}}>Produtos</Card>
              <Card icon="upc" setTela={() => {setTela("Notas")}}>Notas</Card>
              <Card icon="bi bi-person-fill-add" setTela={() => {setTela("Clientes")}}>Clientes</Card>
            </>
          )
        }
        {
          tela === "Produtos" && (
            <Produtos cadastrarProduto={cadastrarProduto} setTela={setTela} setModalCriar={setModalCriar} />
          )
        }
        {
          tela === "Clientes" && (
            <Clientes />
          )
        }
        {
          tela === "Notas" && (
            <Notas />
          )
        }
      </div>
      <ProdutosCriados visible={modalCriar} onClose={() => setModalCriar(false)} itens={itensCriados}/>
    </div>
  );
}
export default Cadastro;

function Card(props) {
  return (
      <div className="col col-sm-2 col-md-3 col-lg-auto">
        <div className="card text-center h-100 shadow-sm" onClick={() => props.setTela()} style={{cursor: 'pointer'}}>
          <div className="card-body px-5 d-flex flex-column justify-content-center align-items-center">
            <i className={`bi bi-${props.icon} mt-0 fs-1`} style={{"color": "rgb(183, 55, 225)"}}></i>
            <p className="card-text mt-2 mb-0 fw-bold" style={{"color": " rgba(147, 51, 179, 1)", "fontWeight": "600"}}>{props.children}</p>
          </div>
        </div>
      </div>
  );
}
