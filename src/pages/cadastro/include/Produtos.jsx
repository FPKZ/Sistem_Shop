import { Form } from "react-bootstrap";
import CadastrarNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useCadastroProduto } from "@hooks/produtos/useCadastroProduto";
import ProdutosFormFields from "@components/ProdutosFormFields";
import { useOutletContext } from "react-router-dom";

export default function Produtos() {
  const {
    cores,
    notas,
    categorias,
    modalCadastroNota,
    setModalCadastroNota,
    modalCadastroCategoria,
    setModalCadastroCategoria,
    modalCriar,
    setModalCriar,
    itensCriados,
    erros,
    validated,
    formValue,
    isLoading,
    pricing,
    imageUpload,
    modalImagens,
    setModalImagens,
    activeTabModalImagens,
    setActiveTabModalImagens,
    removeImagem,
    produtos,
    isProdutoExistente,
    handleSelectProduto,
    handleChange,
    handleSubimit,
  } = useCadastroProduto();
  const { mobile } = useOutletContext();
  console.log(mobile)
  return (
    <div className="w-100 p-3 pt-0 m-0">
      <Form onSubmit={handleSubimit} noValidate>
        {/* === Bloco de Detalhes Básicos === */}
        <ProdutosFormFields
          formValue={formValue}
          erros={erros}
          validated={validated}
          cores={cores}
          notas={notas}
          categorias={categorias}
          produtos={produtos}
          isProdutoExistente={isProdutoExistente}
          handleSelectProduto={handleSelectProduto}
          pricing={pricing}
          imageUpload={imageUpload}
          handleChange={handleChange}
          setModalCadastroCategoria={setModalCadastroCategoria}
          setModalCadastroNota={setModalCadastroNota}
          isLoading={isLoading}
          modalImagens={modalImagens}
          setModalImagens={setModalImagens}
          activeTabModalImagens={activeTabModalImagens}
          setActiveTabModalImagens={setActiveTabModalImagens}
          removeImagem={removeImagem}
          mobile={mobile}
        />
      </Form>

      {modalCadastroNota && (
        <CadastrarNotaModal
          visible={modalCadastroNota}
          onClose={() => setModalCadastroNota(false)}
          produts={false}
        />
      )}
      {modalCadastroCategoria && (
        <CadastroCategoria
          visible={modalCadastroCategoria}
          onClose={() => setModalCadastroCategoria(false)}
        />
      )}
      {modalCriar && (
        <ProdutosCriados
          visible={modalCriar}
          onClose={() => setModalCriar(false)}
          itens={itensCriados}
        />
      )}
    </div>
  );
}
