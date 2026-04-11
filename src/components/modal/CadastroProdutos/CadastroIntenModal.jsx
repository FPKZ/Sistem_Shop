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
    isLoading,
    pricing,
    imageUpload,
    modalImagens,
    setModalImagens,
    removeImagem,
    handleChange,
    handleSubimit,
    validate,
    gerarPayloadData,
    resetForm,
  } = useCadastroProduto((itens) => {
    if (cadastroNota && itens) {
      // No modo nota, apenas repassamos os itens para a nota pai
    }
  }, true);

  // Reset do formulário ao abrir ou fechar o modal para garantir limpeza total
  useEffect(() => {
    resetForm();
    return () => {
      resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]); // resetForm removido daqui para evitar loop infinito com hooks internos

  // Sincronização de props especiais (como cadastrarProduto manual da Nota)
  const finalHandleSubmit = async (e) => {
    if (cadastroNota) {
      if (e && e.preventDefault) e.preventDefault();
      if (validate()) {
        const payload = gerarPayloadData(); // Usar o novo payload JSON
        if (cadastrarProduto) {
          cadastrarProduto(payload);
        }
        onClose();
      }
    } else {
      handleSubimit(e);
    }
  };

  if (!visible) return null;

  return (
    <>
      <Modal
        show={visible}
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
              modalImagens={modalImagens}
              setModalImagens={setModalImagens}
              removeImagem={removeImagem}
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
