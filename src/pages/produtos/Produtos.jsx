import { useState, useEffect } from "react";
import Produto from "./components/Produto";
import CadastroModal from "../components/modal/CadastroIntenModal";
import API from "../../components/app/api.js"


function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [modal, setModal] = useState(false)
  
  const getProduto = async () => {
    const p = await API.getProduto()
    console.log(p)
    setProdutos(p);
  }

  useEffect(() => {
    getProduto()
  }, [])

  const cadastroProduto = async (data) => {
    await API.putProduto(data)
    await getProduto()
  }

  const deleteProduto = async (id) => {
    await API.deleteProduto(id)
    await getProduto()
  }


  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">Produtos</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>
          Adicionar Produto
        </button>
      </div>
    </div>
      <Produto produtos={produtos} deleteProduto={deleteProduto} />


      <CadastroModal visible={modal} onClose={() => setModal(false)} onSubmit={async (data) =>  await cadastroProduto(data)} />
    </>
  );
}

export default Produtos;
