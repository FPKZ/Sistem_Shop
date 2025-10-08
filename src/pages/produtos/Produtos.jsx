import { useState, useEffect } from "react";
import Produto from "./components/Produto";
import CadastroModal from "../../components/modal/CadastroProdutos/CadastroIntenModal.jsx";
import API from "../../app/api.js"
import ProdutosInfo from "@components/modal/InfoProdutos/InfoProdutos";
import { Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

// import "../../../public/css/produtos/produtos.css"

function Produtos() {
  
  const { mobile, setMobile } = useOutletContext()

  const [produto, setProduto] = useState({})
  const [produtos, setProdutos] = useState([]);
  const [modalAddProduto, setModalAddProduto] = useState(false)
  const [modalInfoProduto, setModalInfoProduto] = useState(false)

  const navigate = useNavigate()
  
  const getProduto = async () => {
    const p = await API.getProduto()
    console.log(p)
    setProdutos(p);
  }

  useEffect(() => {
    getProduto()

    const handlePopState = () => {
      if (modalAddProduto || modalInfoProduto){
        setModalAddProduto(false)
        setModalInfoProduto(false)
      }
    }

    if(modalAddProduto || modalInfoProduto){
      window.history.pushState({ modak: true }, '')
      window.addEventListener('popstate', handlePopState)
    }

    const handleResize = () => {
      setMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("popstate", handlePopState)
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


  function HoverBtn({mobile}){
    const [hovered, setHovered] = useState(false)
    

    return (
      <Button type="button" className={`btn-roxo animed-btn ${hovered ? "expanded" : ""}`}
        onClick={() => {

          if(mobile){
            if(hovered){
              setModalAddProduto(true)
              setHovered(false)
            } else {
              setHovered(true)
              setTimeout(() => setHovered(false), 3000)
            }
          } else {
            setModalAddProduto(true)
          }

        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

        <i className="bi bi-plus-lg me-2"></i>
          <span className="text">
            Adicionar Produto
          </span>
      </Button>
    )
  }

  return (
    <div className="p-2 p-md-4 h-100 overflow-hidden">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom position-relative">
        <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate("/")}>
            <i className="bi bi-chevron-left"></i>
        </Button>
        <h1 className="h2">Produtos</h1>
        <div className="btn-toolbar mb-2 mb-md-0 position-absolute end-0">
          <HoverBtn mobile={mobile}/>
        </div>
      </div>
      <Produto produtos={produtos} deleteProduto={deleteProduto} setModalInfoProduto={setModalInfoProduto} setProduto={setProduto} mobile={mobile}/>


      <CadastroModal visible={modalAddProduto}
        onClose={() => setModalAddProduto(false)}
        onSubmit={async (data) =>  await cadastroProduto(data)}
        cadastrarProduto={cadastroProduto}
        mobile={mobile}
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
