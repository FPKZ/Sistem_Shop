import { useState, useEffect } from "react";
import Produto from "./components/Produto";
import CadastroModal from "../../components/modal/CadastroProdutos/CadastroIntenModal.jsx";
import API from "../../app/api.js"
import ProdutosInfo from "@components/modal/InfoProdutos/InfoProdutos";


function Produtos() {
  
  

  const [produto, setProduto] = useState({})
  const [produtos, setProdutos] = useState([]);
  const [modalAddProduto, setModalAddProduto] = useState(false)
  const [modalInfoProduto, setModalInfoProduto] = useState(false)

  const [mobile, setMobile] = useState(window.innerWidth < 768)
  
  const getProduto = async () => {
    const p = await API.getProduto()
    console.log(p)
    setProdutos(p);
  }

  useEffect(() => {
    getProduto()

    const handleResize = () => {
      setMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [ modalAddProduto, modalInfoProduto ])
  
  

  const cadastroProduto = async (data) => {
    await API.postProduto(data)
    await getProduto()
  }

  const deleteProduto = async (id) => {
    await API.deleteProduto(id)
    await getProduto()
  }


  return (
    <div className="p-2 p-md-4 h-100 overflow-hidden">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Produtos</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button className="btn btn-roxo" onClick={() => setModalAddProduto(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            Adicionar Produto
          </button>
        </div>
      </div>
      <Produto produtos={produtos} deleteProduto={deleteProduto} setModalInfoProduto={setModalInfoProduto} setProduto={setProduto}/>


      <CadastroModal visible={modalAddProduto}
        onClose={() => setModalAddProduto(false)}
        onSubmit={async (data) =>  await cadastroProduto(data)}
        cadastrarProduto={cadastroProduto}
      />
      <ProdutosInfo 
        visible={modalInfoProduto}
        onClose={() => setModalInfoProduto(false)}
        produto={produto}
        mobile={mobile}
      />
    </div>
  );
}

export default Produtos;
