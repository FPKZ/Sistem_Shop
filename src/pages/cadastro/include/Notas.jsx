import { Row, Col, Button, Form } from "react-bootstrap";
import TabelaProdutosNota from "@components/modal/CadastroNota/include/TabelaProdutosNota";
import CadastroModal from "@components/modal/CadastroProdutos/CadastroIntenModal";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import ProdutoInfo from "@components/modal/InfoProdutos/InfoProdutos";

import { useNavigate } from "react-router-dom";
import { useCadastroNota } from "@hooks/notas/useCadastroNota";

export default function Notas() {
  const navigate = useNavigate();

  const {
    formValue,
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
  } = useCadastroNota(() => navigate(-1));

  return (
    <div className="w-100 p-3">
      <Form onSubmit={handleSubimit} noValidate>
        <Row className="g-3">
          {/* Linha 1: Numero, Data, Vencimento */}
          <Col xs={12} md={8}>
            <label htmlFor="numeroNota" className="form-label">
              Numero da Nota
            </label>
            <input
              type="number"
              className={`form-control ${
                validated ? (erros.codigo ? `is-invalid` : `is-valid`) : ""
              }`}
              name="codigo"
              id="numeroNota"
              onChange={handleChange}
              required
            />
          </Col>
          <Col xs={6} md={2}>
            <label htmlFor="data" className="form-label">
              Data da nota
            </label>
            <input
              type="date"
              className={`form-control ${
                validated ? (erros.data ? `is-invalid` : `is-valid`) : ""
              }`}
              name="data"
              id="data"
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
              onChange={handleChange}
              required
            />
          </Col>

          {/* Linha 2: Fornecedor, Valor Total, Qnt */}
          <Col xs={12} md={6}>
            <label htmlFor="fornecedor" className="form-label">
              Fornecedor
            </label>
            <input
              type="text"
              className={`form-control ${
                validated ? (erros.fornecedor ? `is-invalid` : `is-valid`) : ""
              }`}
              name="fornecedor"
              id="fornecedor"
              onChange={handleChange}
              required
            />
          </Col>
          <Col xs={6} md={3}>
            <label htmlFor="valor_total" className="form-label">
              Valor da Nota
            </label>
            <input
              type="text"
              className={`form-control ${
                validated ? (erros.valor_total ? `is-invalid` : `is-valid`) : ""
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
              value={
                formValue.quantidade || (incluirProdutos ? produtos.length : "")
              }
              onChange={handleChange}
              readOnly={incluirProdutos}
              required
            />
          </Col>

          {/* Toggle Incluir Produtos */}
          <Col xs={12} className="d-flex align-items-center gap-2 mt-2">
            <Form.Check
              type="switch"
              id="custom-switch-page"
              label="Incluir Produtos na Nota"
              checked={incluirProdutos}
              onChange={(e) => setIncluirProdutos(e.target.checked)}
            />
          </Col>
        </Row>

        {incluirProdutos && (
          <div
            className="d-flex flex-column grow overflow-hidden mt-3 border rounded"
            style={{ height: "400px" }}
          >
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

        <Button
          variant="outline-secondary"
          className="btn-roxo mt-3 w-100"
          disabled={isLoading || modalCadastroPrduto}
          type="submit"
        >
          Adicionar
        </Button>
      </Form>
      <CadastroModal
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
    </div>
  );
}
