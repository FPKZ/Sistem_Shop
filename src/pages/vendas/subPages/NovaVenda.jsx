import { Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "@app/api";

import ModalSelecionarCliente from "@components/modal/Vendas/ModalSelecionarCliente";
import ModalAdicionarProduto from "@components/modal/Vendas/ModalAdicionarProduto";
import ModalAdicionarPagamento from "@components/modal/Vendas/ModalAdicionarPagamento";

import { useToast } from "@contexts/ToastContext";
import { useLoadRequest } from "@hooks/useLoadRequest";
import { useVendaCart } from "@hooks/vendas/useVendaCart";
import { usePagamentoVenda } from "@hooks/vendas/usePagamentoVenda";

import { VendaHeader } from "./components/VendaHeader";
import { VendaCart } from "./components/VendaCart";
import { VendaResumo } from "./components/VendaResumo";

export default function NovaVenda() {
  const navigate = useNavigate();
  const { mobile } = useOutletContext();
  const { showToast } = useToast();
  const [isLoading, request] = useLoadRequest();

  const [cliente, setCliente] = useState(null);
  const [reservar, setReservar] = useState(false);

  // Controle de Modais Locais
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalProduto, setShowModalProduto] = useState(false);
  const [showModalPagamento, setShowModalPagamento] = useState(false);

  // Busca do Estoque
  const {
    data: produtos,
    isLoading: isLoadingProdutos,
    error: errorProdutos,
  } = API.getProdutos({ item: "estoque" });

  // Hooks de Domínio
  const cart = useVendaCart(produtos || []);
  const pagamentoState = usePagamentoVenda(
    cart.calcularSubtotal(),
    cart.calcularCompraBase(),
  );

  useEffect(() => {
    const reservarEstoque = async () => {
      if (cliente && reservar) {
        await Promise.all(
          cart.listaVenda.map((item) =>
            item.itens.map((i) => API.reservarProduto(i.id, cliente.id)),
          ),
        );
      }
    };
    reservarEstoque();
  }, [cart.listaVenda, cliente, reservar]);

  const handleFinalizarVenda = async () => {
    if (!cliente) return alert("Selecione um cliente!");
    if (cart.listaVenda.length === 0)
      return alert("Adicione pelo menos um produto!");

    const itens = [];
    cart.listaVenda.map((item) =>
      item.itens.map((i) =>
        itens.push({
          itemEstoque_id: i.id,
          valor_unitario: i.valor_venda,
        }),
      ),
    );

    const currentDate = new Date().toISOString();
    const status = pagamentoState.pagamentos.every(
      (item) => item.forma_pagamento === "Promissória",
    )
      ? "pendente"
      : "concluida";

    const venda = {
      cliente_id: cliente.id,
      data_venda: currentDate,
      notaVenda: pagamentoState.pagamentos,
      desconto: pagamentoState.desconto,
      valor_total: pagamentoState.calcularTotalComDesconto(),
      status: status,
      itensVendidos: itens,
    };

    request(async () => {
      const response = await API.postVenda(venda);
      if (response.ok) {
        showToast("Venda finalizada com sucesso!", "success");
        navigate("/vendas");
      } else {
        showToast("Erro ao finalizar venda!", "error");
      }
    });
  };

  const handleCancelarVenda = async () => {
    await Promise.all(
      cart.listaVenda.map((item) => cart.handleRemoverProduto(item.id)),
    );
    navigate("/vendas");
  };

  return (
    <>
      <VendaHeader reservar={reservar} setReservar={setReservar} />

      <Row className="g-4">
        <Col lg={8} className="m-0">
          <VendaCart
            mobile={mobile}
            cliente={cliente}
            setShowModalCliente={setShowModalCliente}
            listaVenda={cart.listaVenda}
            setShowModalProduto={setShowModalProduto}
            produtos={produtos || []}
            handleAlterarQuantidade={cart.handleAlterarQuantidade}
            handleRemoverProduto={cart.handleRemoverProduto}
          />
        </Col>

        <Col lg={4} className="m-0">
          <VendaResumo
            cliente={cliente}
            listaVenda={cart.listaVenda}
            pagamentos={pagamentoState.pagamentos}
            handleRemoverPagamento={pagamentoState.handleRemoverPagamento}
            handleEditarPagamento={pagamentoState.handleEditarPagamento}
            setShowModalPagamento={setShowModalPagamento}
            calcularSubtotal={cart.calcularSubtotal}
            displayDesconto={pagamentoState.displayDesconto}
            handleDescontoChange={pagamentoState.handleDescontoChange}
            calcularTotalComDesconto={pagamentoState.calcularTotalComDesconto}
            sobra={pagamentoState.sobra}
            handleFinalizarVenda={handleFinalizarVenda}
            handleCancelarVenda={handleCancelarVenda}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      {/* Modals */}
      {showModalCliente && (
        <ModalSelecionarCliente
          show={showModalCliente}
          onHide={() => setShowModalCliente(false)}
          onSelect={setCliente}
        />
      )}

      {showModalProduto && !isLoadingProdutos && !errorProdutos && (
        <ModalAdicionarProduto
          show={showModalProduto}
          onHide={() => setShowModalProduto(false)}
          produtos={produtos}
          onAdd={cart.handleAdicionarProduto}
          calcularItensAjustados={cart.calcularItensAjustados}
        />
      )}

      {showModalPagamento && (
        <ModalAdicionarPagamento
          show={showModalPagamento}
          onHide={() => setShowModalPagamento(false)}
          valorTotal={pagamentoState.sobra}
          total={pagamentoState.calcularTotalComDesconto()}
          onAdd={pagamentoState.handleAdicionarPagamento}
          pagamentoEdit={pagamentoState.pagamentoAtivo}
        />
      )}
    </>
  );
}
