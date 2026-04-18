import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@services";
import { useToast } from "@contexts/ToastContext";
import { useLoadRequest } from "@hooks/useLoadRequest";
import { useVendaCart } from "./useVendaCart";
import { usePagamentoVenda } from "./usePagamentoVenda";

export function useNovaVenda(produtos) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, request] = useLoadRequest();

  const [cliente, setCliente] = useState(null);
  const [reservar, setReservar] = useState(false);
  const [prazoReserva, setPrazoReserva] = useState(3);
  const [vendaId, setVendaId] = useState(null);

  // Hooks do domínio Venda
  const cart = useVendaCart(produtos || []);
  const pagamentoState = usePagamentoVenda(
    cart.calcularSubtotal(),
    cart.calcularCompraBase()
  );

  // Carregar venda existente da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("vendaId");
    if (id && produtos && produtos.length > 0) {
      setVendaId(id);
      const fetchVenda = async () => {
        const response = await API.getVendaById(id);
        if (response && response.id) {
          setCliente(response.cliente);
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
          cart.handleCarregarCarrinho(Object.values(grupos));
          setReservar(false);
        }
      };
      fetchVenda();
    }
  }, [produtos, cart.handleCarregarCarrinho]);

  // Reservar estoque temporário durante criação da reserva
  useEffect(() => {
    const reservarEstoque = async () => {
      if (cliente && reservar) {
        await Promise.all(
          cart.listaVenda.map((item) =>
            item.itens.map((i) => API.reservarProduto(i.id, cliente.id))
          )
        );
      }
    };
    reservarEstoque();
  }, [cart.listaVenda, cliente, reservar]);

  const handleFinalizarVenda = async () => {
    if (!cliente) return showToast("Selecione um cliente!", "error");
    if (cart.listaVenda.length === 0)
      return showToast("Adicione pelo menos um produto!", "error");

    const itens = [];
    cart.listaVenda.forEach((item) =>
      item.itens.forEach((i) =>
        itens.push({
          itemEstoque_id: i.id,
          valor_unitario: i.valor_venda,
        })
      )
    );

    const currentDate = new Date();
    const status = pagamentoState.pagamentos.every(
      (item) => item.forma_pagamento === "Promissória"
    )
      ? "pendente"
      : "concluida";

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
      reservar,
      prazo_reserva: data_expiracao ? data_expiracao.toISOString() : null,
    };

    request(async () => {
      let response;
      if (vendaId) {
        response = await API.putFinalizarVenda(vendaId, venda);
      } else {
        response = await API.postVenda(venda);
      }

      if (response.ok) {
        showToast(
          vendaId
            ? "Venda finalizada com sucesso!"
            : reservar
            ? "Reserva realizada com sucesso!"
            : "Venda finalizada com sucesso!",
          "success"
        );
        navigate("/painel/vendas");
      } else {
        showToast(response.message || "Erro ao processar venda!", "error");
      }
    });
  };

  const handleCancelarVenda = async () => {
    await Promise.all(
      cart.listaVenda.map((item) => cart.handleRemoverProduto(item.id))
    );
    navigate("/painel/vendas");
  };

  const canFinalize =
    cliente &&
    cart.listaVenda.length > 0 &&
    (reservar ||
      (!reservar && pagamentoState.pagamentos.length > 0 && pagamentoState.sobra <= 0)) &&
    !isLoading;

  return {
    cliente,
    setCliente,
    reservar,
    setReservar,
    prazoReserva,
    setPrazoReserva,
    cart,
    pagamentoState,
    handleFinalizarVenda,
    handleCancelarVenda,
    canFinalize,
    isLoading
  };
}
