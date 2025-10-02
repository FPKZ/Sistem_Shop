import { useState, useEffect } from "react";
import { Card } from "@components/Card"
import { useNavigate } from "react-router-dom";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados"
import Produtos from "./produtos/Produtos";
import Clientes from "./clientes/Clientes";
import Notas from "./notas/Notas";
import API from "../../app/api.js"


function Cadastro() {
  const [tela, setTela] = useState()
  const [itensCriados,  setItensCriados] = useState([])
  const [modalCriar, setModalCriar] = useState(false)
  const navigate = useNavigate()
  



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
      <div className="d-flex justify-content-start flex-wrap flex-md-nowarp align-items-start pb-3 mb-3 gap-2 border-bottom">
        <button className="btn btn-roxo" onClick={() => {tela === "" ? navigate("/") : setTela("")}}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <nav className="d-flex justify-content-center align-items-center m-0" style={{'--bs-breadcrumb-divider': `url('/assets/chevron-right.svg')`}} aria-label="breadcrumb">
          <ol className="breadcrumb d-flex align-content-center m-0">
            <li className="breadcrumb-item"><h1 className="h2 m-0">Cadastrar</h1></li>
            {tela && (
              <h1 className="h2 breadcrumb-item m-0">{tela}</h1>
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
