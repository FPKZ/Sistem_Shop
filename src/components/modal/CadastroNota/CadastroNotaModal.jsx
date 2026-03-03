import { Modal, Row, Col, Form } from "react-bootstrap";
import TabelaProdutosNota from "./include/TabelaProdutosNota";
import CadastroIntenModal from "@components/modal/CadastroProdutos/CadastroIntenModal";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import ProdutoInfo from "@components/modal/InfoProdutos/InfoProdutos";
import { useOutletContext } from "react-router-dom";
import { useCadastroNota } from "@hooks/notas/useCadastroNota";
import { useEffect } from "react";

export default function CadastroNotaModal({ visible, onClose }) {
  const { mobile } = useOutletContext();

  const {
    formValue,
    setFormValue,
    erros,
    validated,
    incluirProdutos,
    setIncluirProdutos,
    itemEstoque,
    setItemEstoque,
    produtos,
    modalCadastroPrduto,
    setmodalCadastroPrduto,
    modalInfoProduto,
    setmodalInfoProduto,
    modalCriar,
    setModalCriar,
    itensCriados,
    isLoading,
    valorTotalHook,
    cadastrarProduto,
    removerProduto,
    handleChange,
    handleSubimit,
  } = useCadastroNota(onClose);

  useEffect(() => {
    if (!visible) {
      setFormValue({});
      setIncluirProdutos(false);
    }
  }, [visible, setFormValue, setIncluirProdutos]);

  return (
    <>
      <Modal
        show={visible}
        onHide={onClose}
        fullscreen={mobile ? true : "md-down"}
        size="xl"
        centered
        contentClassName={`${
          mobile ? "h-100" : produtos.length > 0 ? "h-90" : ""
        }`}
        dialogClassName={`${
          mobile ? "h-100" : produtos.length > 0 ? "h-90" : ""
        }`}
      >
        <Form
          onSubmit={handleSubimit}
          noValidate
          className="d-flex flex-column h-100"
        >
          <Modal.Header closeButton className="shrink-0">
            <Modal.Title>Cadastrar Nota</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column overflow-hidden">
            <div className="shrink-0">
              <Row className="g-3">
                <Col xs={12} md={8}>
                  <label htmlFor="numeroNota" className="form-label">
                    Numero da Nota
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated
                        ? erros.codigo
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="codigo"
                    id="numeroNota"
                    value={formValue.codigo || ""}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <label htmlFor="data" className="form-label">
                    Data
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validated ? (erros.data ? `is-invalid` : `is-valid`) : ""
                    }`}
                    name="data"
                    id="data"
                    value={formValue.data || ""}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <label htmlFor="data_vencimento" className="form-label">
                    Vencimento
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      validated
                        ? erros.data_vencimento
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="data_vencimento"
                    id="data_vencimento"
                    value={formValue.data_vencimento || ""}
                    onChange={handleChange}
                    required
                  />
                </Col>

                <Col xs={12} md={6}>
                  <label htmlFor="fornecedor" className="form-label">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated
                        ? erros.fornecedor
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="fornecedor"
                    id="fornecedor"
                    value={formValue.fornecedor || ""}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col xs={6} md={3}>
                  <label htmlFor="valor_total" className="form-label">
                    Valor Total
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated
                        ? erros.valor_total
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="valor_total"
                    id="valor_total"
                    placeholder="R$ 0,00"
                    value={valorTotalHook.displayValue}
                    onChange={valorTotalHook.onChange}
                    required
                  />
                </Col>
                <Col xs={6} md={3}>
                  <label htmlFor="quantidade" className="form-label">
                    Qnt. Produtos
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      validated && !incluirProdutos
                        ? erros.quantidade
                          ? `is-invalid`
                          : `is-valid`
                        : ""
                    }`}
                    name="quantidade"
                    id="quantidade"
                    value={formValue.quantidade || ""}
                    onChange={handleChange}
                    readOnly={incluirProdutos}
                    required
                  />
                </Col>

                <Col xs={12} className="d-flex align-items-center gap-2 mt-2">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Incluir Produtos na Nota"
                    checked={incluirProdutos}
                    onChange={(e) => setIncluirProdutos(e.target.checked)}
                  />
                </Col>
              </Row>
            </div>

            {incluirProdutos && (
              <div className="d-flex flex-column grow overflow-hidden mt-3 border rounded">
                <div className="d-flex justify-content-between p-2 border-bottom bg-light shrink-0">
                  <p className="align-content-center m-0 fw-bold">
                    Produtos da Nota
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    type="button"
                    onClick={() => setmodalCadastroPrduto(true)}
                  >
                    + Adicionar Produto
                  </button>
                </div>
                <div className="grow overflow-y-auto bg-white">
                  {produtos.length > 0 ? (
                    <TabelaProdutosNota
                      mobile={mobile}
                      produto={produtos}
                      setItemEstoque={setItemEstoque}
                      setmodalInfoProduto={setmodalInfoProduto}
                      removerProduto={removerProduto}
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 text-muted p-4">
                      Nenhum produto adicionado
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 shrink-0">
              <button
                className="btn btn-roxo w-100"
                disabled={isLoading || modalCadastroPrduto}
                type="submit"
              >
                {isLoading ? "Salvando..." : "Salvar Nota"}
              </button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
      <CadastroIntenModal
        visible={modalCadastroPrduto}
        onClose={() => setmodalCadastroPrduto(false)}
        cadastroNota={true}
        cadastrarProduto={cadastrarProduto}
      />
      <ProdutoInfo
        visible={modalInfoProduto}
        onClose={() => setmodalInfoProduto(false)}
        tableShow={false}
        produto={itemEstoque}
      />
      <ProdutosCriados
        visible={modalCriar}
        onClose={() => setModalCriar(false)}
        itens={itensCriados}
      />
    </>
  );
}
