import { useState } from "react";
import API from "@app/api";

export function useVendaCart(produtos) {
  const [listaVenda, setListaVenda] = useState([]);

  const handleAdicionarProduto = async (produto) => {
    const produtoExistente = listaVenda.find((item) => item.id === produto.id);

    if (produtoExistente) {
      setListaVenda(
        listaVenda.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + produto.quantidade,
                itens: item.itens.concat(produto.itens),
              }
            : item,
        ),
      );
    } else {
      setListaVenda([...listaVenda, produto]);
    }
  };

  const handleRemoverProduto = async (id) => {
    const produto = listaVenda.find((item) => item.id === id);
    produto.itens.map(async (item) => {
      await API.removerProduto(item.id, { status: "Disponivel" });
    });
    setListaVenda(listaVenda.filter((item) => item.id !== id));
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

    const produto = produtos.find((p) => p.id === id);
    const itemVenda = listaVenda.find((item) => item.id === id);

    if (novaQuantidade > produto.itemEstoque.length) {
      alert("Quantidade maior que o estoque disponível!");
      return;
    }

    const novosItens = calcularItensAjustados(
      itemVenda.itens,
      produto.itemEstoque,
      novaQuantidade,
    );

    setListaVenda(
      listaVenda.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: novaQuantidade,
              itens: novosItens,
            }
          : item,
      ),
    );
  };

  const calcularSubtotal = () => {
    return listaVenda.reduce(
      (total, item) =>
        total + item.itens.reduce((total, i) => total + i.valor_venda, 0),
      0,
    );
  };

  const calcularCompraBase = () => {
    return listaVenda.reduce(
      (total, item) =>
        total + item.itens.reduce((total, i) => total + i.valor_compra, 0),
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
    handleAlterarQuantidade,
    calcularItensAjustados,
    calcularSubtotal,
    calcularCompraBase,
    esvaziarCart,
  };
}
