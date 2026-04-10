import { Form } from "react-bootstrap";
import CadastrarNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useCadastroProduto } from "@hooks/produtos/useCadastroProduto";
import ProdutosFormFields from "@components/ProdutosFormFields";

export default function Produtos() {
  const {
    cores,
    notas,
    categorias,
    modalCadastroNota,
    setModalCadastroNota,
    modalCadastroCategoria,
    setModalCadastroCategoia,
    modalCriar,
    setModalCriar,
    itensCriados,
    erros,
    validated,
    formValue,
    isLoading,
    pricing,
    imageUpload,
    handleChange,
    handleSubimit,
  } = useCadastroProduto();

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
          pricing={pricing}
          imageUpload={imageUpload}
          handleChange={handleChange}
          setModalCadastroCategoia={setModalCadastroCategoia}
          setModalCadastroNota={setModalCadastroNota}
          isLoading={isLoading}
        />
      </Form>

      <CadastrarNotaModal
        visible={modalCadastroNota}
        onClose={() => setModalCadastroNota(false)}
        produts={false}
      />
      <CadastroCategoria
        visible={modalCadastroCategoria}
        onClose={() => setModalCadastroCategoia(false)}
      />
      <ProdutosCriados
        visible={modalCriar}
        onClose={() => setModalCriar(false)}
        itens={itensCriados}
      />
    </div>
  );
}
