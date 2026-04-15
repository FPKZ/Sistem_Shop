import { useState } from "react";
import API from "@services";

export function useVendaCart(produtos) {
  const [listaVenda, setListaVenda] = useState([]);

  const handleAdicionarProduto = (produto) => {
    setListaVenda((prevLista) => {
      const produtoExistente = prevLista.find((item) => item.id === produto.id);

      if (produtoExistente) {
        return prevLista.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + produto.quantidade,
                itens: item.itens.concat(produto.itens),
              }
            : item,
        );
      } else {
        return [...prevLista, produto];
      }
    });
  };

  const handleRemoverProduto = async (id) => {
    // Obter itens antes de remover para disparar API
    setListaVenda((prevLista) => {
      const produto = prevLista.find((p) => p.id === id);
      if (produto) {
        // Disparar liberação de itens no estoque (side effect controlado)
        Promise.all(
          produto.itens.map((item) =>
            API.removerProduto(item.id, { status: "Disponivel" }),
          ),
        );
      }
      return prevLista.filter((item) => item.id !== id);
    });
  };

  const handleCarregarCarrinho = (lista) => {
    setListaVenda(lista);
  };

  const calcularItensAjustados = (itensAtuais, todosItens, novaQuantidade) => {
    const diferencaQuantidade = novaQuantidade - itensAtuais.length;
    let novosItens = [...itensAtuais];

    if (diferencaQuantidade > 0) {
      const idsJaSelecionados = itensAtuais.map((i) => i.id);
      const itensParaAdicionar = [];

      for (const item of todosItens) {
        if (!idsJaSelecionados.includes(item.id)) {
          itensParaAdicionar.push(item);
          if (itensParaAdicionar.length >= diferencaQuantidade) {
            break;
          }
        }
      }
      novosItens = [...itensAtuais, ...itensParaAdicionar];
    } else if (diferencaQuantidade < 0) {
      novosItens = itensAtuais.slice(0, novaQuantidade);
    }
    return novosItens;
  };

  const handleAlterarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade < 1) return;

    setListaVenda((prevLista) => {
      const produto = produtos.find((p) => p.id === id);
      const itemVenda = prevLista.find((item) => item.id === id);

      if (!produto || !itemVenda) return prevLista;

      if (novaQuantidade > produto.itemEstoque.length) {
        alert("Quantidade maior que o estoque disponível!");
        return prevLista;
      }

      const novosItens = calcularItensAjustados(
        itemVenda.itens,
        produto.itemEstoque,
        novaQuantidade,
      );

      return prevLista.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: novaQuantidade,
              itens: novosItens,
            }
          : item,
      );
    });
  };

  const calcularSubtotal = () => {
    return listaVenda.reduce(
      (total, item) =>
        total +
        (item.itens?.reduce((total, i) => total + i.valor_venda, 0) || 0),
      0,
    );
  };

  const calcularCompraBase = () => {
    return listaVenda.reduce(
      (total, item) =>
        total +
        (item.itens?.reduce((total, i) => total + i.valor_compra, 0) || 0),
      0,
    );
  };

  const esvaziarCart = () => {
    setListaVenda([]);
  };

  return {
    listaVenda,
    handleAdicionarProduto,
    handleRemoverProduto,
    handleCarregarCarrinho,
    handleAlterarQuantidade,
    calcularItensAjustados,
    calcularSubtotal,
    calcularCompraBase,
    esvaziarCart,
  };
}
