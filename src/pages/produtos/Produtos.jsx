import { useState, useEffect } from "react";
import Produto from "./components/Produto";
import CadastroModal from "../components/modal/CadastroIntenModal";
import API from "../../components/app/api.js"
import ProdutoInfo from "./components/ProdutosInfo.jsx";


function Produtos() {
  const [categoria , setCategoria] = useState({})
  const [nota , setNota] = useState({})
  const [notas, setNotas] = useState([])
  const [categorias, setCategorias] = useState([])

  const [produto, setProduto] = useState({})
  const [produtos, setProdutos] = useState([]);
  const [modalAddProduto, setModalAddProduto] = useState(false)
  const [modalInfoProduto, setModalInfoProduto] = useState(false)
  
  const getProduto = async () => {
    const p = await API.getProduto()
    //console.log(p)
    setProdutos(p);
  }

  useEffect(() => {
    getProduto()
    GetNotas()
    GetCategorias()
  }, [])
  
  const GetCategorias = async () => {
      const data = await API.getCategoria()
      //console.log(data)
      setCategorias(data)
  }
  const GetNotas = async () => {
      const data = await API.getNotas()
      //console.log(data)
      setNotas(data)
  }

  const cadastroProduto = async (data) => {
    await API.postProduto(data)
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
        categorias={categorias}
        categoria={categoria}
        setCategoria={setCategoria}
        notas={notas}
        nota={nota}
        setNota={setNota}
        cadastrarProduto={cadastroProduto}
      />
      <ProdutoInfo 
        visible={modalInfoProduto}
        onClose={() => setModalInfoProduto(false)}
        categorias={categorias}
        categoria={categoria}
        setCategoria={setCategoria}
        notas={notas}
        nota={nota}
        setNota={setNota}
        produto={produto}
      />
    </>
  );
}

export default Produtos;
