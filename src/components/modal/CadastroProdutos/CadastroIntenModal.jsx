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
    valorCompraHook,
    valorVendaHook,
    lucroHook,
    handleChange,
    handleValorCompraChange,
    handleValorVendaChange,
    handleLucroChange,
    handleSubimit,
    validate,
    gerarFormData,
  } = useCadastroProduto((itens) => {
    if (cadastroNota && itens) {
      // No modo nota, apenas repassamos os itens para a nota pai
      // O hook já faz o loop, mas aqui o modal original tinha uma lógica de cadastrarProduto(FormData)
      // que vinha por props. Vamos manter a compatibilidade se necessário.
    }
  }, true);

  // Sincronização de props especiais (como cadastrarProduto manual da Nota)
  // No modal original de Nota, o cadastrarProduto apenas adicionava ao array local da Nota.
  // Vamos interceptar o submit se for cadastroNota
  const finalHandleSubmit = async (e) => {
    if (cadastroNota) {
      e.preventDefault();
      // Usamos o validate e gerarFormData do hook para garantir consistência
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
      setFormValue({ quantidade: 1 })
      setValidated(false);
      setErros({});
    }
  }, [visible, setFormValue, setValidated, setErros]);

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
              valorCompraHook={valorCompraHook}
              valorVendaHook={valorVendaHook}
              lucroHook={lucroHook}
              handleChange={handleChange}
              handleValorCompraChange={handleValorCompraChange}
              handleValorVendaChange={handleValorVendaChange}
              handleLucroChange={handleLucroChange}
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
