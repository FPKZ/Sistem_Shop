import { Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "@services";

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
  const [prazoReserva, setPrazoReserva] = useState(3); // Padrão 3 dias
  const [vendaId, setVendaId] = useState(null);

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

  // Carregar venda se houver vendaId na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("vendaId");
    if (id && produtos && produtos.length > 0) {
      setVendaId(id);
      const fetchVenda = async () => {
        const response = await API.getVendaById(id);
        if (response && response.id) {
          setCliente(response.cliente);

          // Agrupar itens por produto
          const grupos = {};
          response.itensVendidos.forEach((iv) => {
            const item = iv.itemEstoque;
            const produtoId = item.produto.id;
            if (!grupos[produtoId]) {
              grupos[produtoId] = {
                ...item.produto,
                itens: [],
                quantidade: 0,
              };
            }
            grupos[produtoId].itens.push(item);
            grupos[produtoId].quantidade += 1;
          });

          // Adicionar grupos ao carrinho de uma só vez
          cart.handleCarregarCarrinho(Object.values(grupos));

          // Se for uma reserva sendo finalizada, desativamos o switch reservar
          setReservar(false);
        }
      };
      fetchVenda();
    }
  }, [produtos, cart.handleCarregarCarrinho]); // Dependente de produtos para garantir que o cart funcione

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

    const currentDate = new Date();
    const status = pagamentoState.pagamentos.every(
      (item) => item.forma_pagamento === "Promissória",
    )
      ? "pendente"
      : "concluida";

    // Calcular data de expiração se for reserva
    let data_expiracao = null;
    if (reservar) {
      data_expiracao = new Date();
      data_expiracao.setDate(data_expiracao.getDate() + prazoReserva);
    }

    const venda = {
      cliente_id: cliente.id,
      data_venda: currentDate.toISOString(),
      notaVenda: pagamentoState.pagamentos,
      desconto: pagamentoState.desconto,
      valor_total: pagamentoState.calcularTotalComDesconto(),
      status: reservar ? "pendente" : status,
      itensVendidos: itens,
      reservar: reservar,
      prazo_reserva: data_expiracao ? data_expiracao.toISOString() : null,
    };

    request(async () => {
      let response;
      if (vendaId) {
        // Finalizando uma reserva existente
        response = await API.putFinalizarVenda(vendaId, venda);
      } else {
        // Criando nova venda ou reserva
        response = await API.postVenda(venda);
      }

      if (response.ok) {
        showToast(
          vendaId
            ? "Venda finalizada com sucesso!"
            : reservar
              ? "Reserva realizada com sucesso!"
              : "Venda finalizada com sucesso!",
          "success",
        );
        navigate("/vendas");
      } else {
        showToast(response.message || "Erro ao processar venda!", "error");
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
        <Col lg={8}>
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

        <Col lg={4}>
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
            reservar={reservar}
            prazoReserva={prazoReserva}
            setPrazoReserva={setPrazoReserva}
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
