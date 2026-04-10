import Produto from "./components/Produto";
import HoverBtn from "@components/HoverBtn";
import CadastroModal from "../../components/modal/CadastroProdutos/CadastroIntenModal.jsx";
import ProdutosInfo from "@components/modal/InfoProdutos/InfoProdutos";
import useProdutosPage from "@hooks/produtos/useProdutosPage";

function Produtos() {
  const {
    mobile,
    produtos,
    produto,
    setProduto,
    cadastrarProduto,
    modalInfoProduto,
    setModalInfoProduto,
    deleteProduto,
  } = useProdutosPage();

  return (
    <div className="p-md-4 h-100 overflow-hidden">
      <Produto
        produtos={produtos}
        deleteProduto={deleteProduto}
        setModalInfoProduto={setModalInfoProduto}
        setProduto={setProduto}
        mobile={mobile}
      >
        <HoverBtn mobile={mobile} func={cadastrarProduto}>
          Adicionar Produto
        </HoverBtn>
      </Produto>
      <ProdutosInfo
        visible={modalInfoProduto}
        onClose={() => setModalInfoProduto(false)}
        produto={produto}
        deletarProduto={deleteProduto}
        mobile={mobile}
      />
    </div>
  );
}

export default Produtos;
