import { useState, useEffect } from "react";
import Produto from "./components/Produto";
import HoverBtn from "@components/HoverBtn";
import CadastroModal from "../../components/modal/CadastroProdutos/CadastroIntenModal.jsx";
import API from "@app/api.js"
import ProdutosInfo from "@components/modal/InfoProdutos/InfoProdutos";
import { useOutletContext } from "react-router-dom";
import usePopStateModal from "@hooks/usePopStateModal";
import { useToast } from "@contexts/ToastContext";
import useProdutos from "@app/data/produtos";


// import "../../../public/css/produtos/produtos.css"

function Produtos() {
  
  const { mobile } = useOutletContext()

  const [produto, setProduto] = useState({})
  // const [produtos, setProdutos] = useState([]);
  const [modalAddProduto, setModalAddProduto] = useState(false)
  const [modalInfoProduto, setModalInfoProduto] = useState(false)

  const [produtos, getProdutos] = useProdutos();


  const { showToast } = useToast();

  

  usePopStateModal(
    [modalAddProduto, modalInfoProduto],
    [setModalAddProduto, setModalInfoProduto]
  )
  


  useEffect(() => {
    getProdutos()

    // const handlePopState = () => {
    //   if (modalAddProduto || modalInfoProduto){
    //     setModalAddProduto(false)
    //     setModalInfoProduto(false)
    //   }
    // }

    // if(modalAddProduto || modalInfoProduto){
    //   window.history.pushState({ modak: true }, '')
    //   window.addEventListener('popstate', handlePopState)
    // }

    // const handleResize = () => {
    //   setMobile(window.innerWidth < 768)
    // }

    // window.addEventListener("resize", handleResize)

    return () => {
      // window.removeEventListener("resize", handleResize)
      // window.removeEventListener("popstate", handlePopState)
    }
  }, [ modalAddProduto, modalInfoProduto ])
  
  

  const cadastroProduto = async (data) => {
    const response = await API.postProduto(data)
    if(response.ok){
      showToast(response.message, "success")
    }
    else{
      showToast(response.message, "error")
    } 
    await getProduto()
    return response;
  }

  const deleteProduto = async (id) => {
    const response = await API.deleteProduto(id)
    if(response.ok){
      showToast(response.message, "success")
    }
    else{
      showToast(response.message, "error")
    }
    await getProduto()
  }
  
  return (
    <div className="p-md-4 h-100 overflow-hidden">
      <Produto produtos={produtos} deleteProduto={deleteProduto} setModalInfoProduto={setModalInfoProduto} setProduto={setProduto} mobile={mobile}>
        <HoverBtn mobile={mobile} func={setModalAddProduto}>Adicionar Produto</HoverBtn>
      </Produto>


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
