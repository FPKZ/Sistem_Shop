import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import ProdutosFormFields from "@components/ProdutosFormFields";
import { useCadastroProduto } from "@hooks/produtos/useCadastroProduto";
import { Cores } from "@components/Cores";
import { useEffect } from "react";

function CadastroIntenModal({
  visible,
  onClose,
  cadastrarProduto,
  cadastroNota = false,
}) {
  const {
    cores,
    notas,
    categorias,
    modalCadastroCategoria,
    setModalCadastroCategoia,
    modalCriar,
    setModalCriar,
    itensCriados,
    erros,
    setErros,
    validated,
    setValidated,
    formValue,
    setFormValue,
    isLoading,
    pricing,
    imageUpload,
    handleChange,
    handleSubimit,
    validate,
    gerarFormData,
  } = useCadastroProduto((itens) => {
    if (cadastroNota && itens) {
      // No modo nota, apenas repassamos os itens para a nota pai
    }
  }, true);

  // Sincronização de props especiais (como cadastrarProduto manual da Nota)
  const finalHandleSubmit = async (e) => {
    if (cadastroNota) {
      if (e && e.preventDefault) e.preventDefault();
      if (validate()) {
        const formData = gerarFormData();
        if (cadastrarProduto) {
          cadastrarProduto(formData);
        }
        onClose();
      }
    } else {
      handleSubimit(e);
    }
  };

  useEffect(() => {
    setModalCriar(visible)
    if (!visible) {
      setFormValue({
        nome: "",
        img: null,
        cor: null,
        categoria_id: null,
        marca: "",
        tamanho: "",
        nota_id: null,
        codigo_barras: "",
        quantidade: 1,
        valor_compra: null,
        valor_venda: null,
        lucro: null,
        descricao: "",
      });
      setValidated(false);
      setErros({});
      pricing.handlers.resetPricing();
      imageUpload.handlers.clearImage();
    }
  }, [visible, setFormValue, setValidated, setErros, pricing.handlers, imageUpload.handlers, setModalCriar]);

  if (!visible) return null;

  return (
    <>
      <Modal
        show={modalCriar}
        onHide={onClose}
        size="xl"
        centered
        fullscreen="md-down"
        animation
      >
        <Form onSubmit={finalHandleSubmit} noValidate>
          <Modal.Header closeButton>
            <Modal.Title>Cadastrar Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
              cadastroNota={cadastroNota}
              isLoading={isLoading}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-roxo w-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <CadastroCategoria
        visible={modalCadastroCategoria}
        onClose={() => setModalCadastroCategoia(false)}
      />

      <ProdutosCriados
        visible={modalCriar}
        onClose={() => {
          setModalCriar(false);
          onClose();
        }}
        itens={itensCriados}
      />
    </>
  );
}

export default CadastroIntenModal;
