import { Produto, Categoria, ItemEstoque } from "../database/models/index.js";
import { Op } from "sequelize";
import { isNullOrUndefined } from "../utils/helpers.js";
import { env } from "../config/env.js";
import { getColorsList, getColorName } from "./cores.service.js";


/**
 * Lista os produtos do catálogo público aplicando filtros opcionais.
 * @param {{ categoria?: string, nome?: string, id?: string }} query
 * @returns {Promise<Array>}
 */
export async function listarCatalogo(query = {}) {
  const where = {};

  if (!isNullOrUndefined(query.categoria)) {
    where.categoria_id = query.categoria;
  }

  if (!isNullOrUndefined(query.nome)) {
    where.nome = { [Op.like]: `%${query.nome}%` };
  }

  if (!isNullOrUndefined(query.id)) {
    where.id = query.id;
  }

  const produtos = await Produto.findAll({
    where,
    include: [
      { model: Categoria, as: "categoria" },
      { model: ItemEstoque, as: "itemEstoque" },
    ],
  });
  const data = await Promise.all(produtos.map(async (produto) => ({
    id:         produto.id,
    nome:       produto.nome,
    descricao:  produto.descricao,
    categoria:  produto.categoria.nome,
    img:        produto.img,
    cores: await getColorsList([...new Set(produto.itemEstoque.map((item) => item.cor))].sort()),
    preco: produto.itemEstoque.some((item) => item.status === "Disponivel")
      ? Math.max(
          ...produto.itemEstoque
            .filter((item) => item.status === "Disponivel")
            .map((item) => Number(item.valor_venda))
        )
      : 0,
    quantidade: produto.itemEstoque.length,
    tamanho: [...new Set(produto.itemEstoque.map((item) => item.tamanho))].filter((item) => item !== "").sort()
  })));

  return data;
}

/**
 * Gera o link do WhatsApp para um pedido.
 * @param {Array<{ id: number, quantidade: number }>} pedido
 * @param {number} total
 * @param {Array} produtos - Produtos carregados do banco
 * @returns {string} URL do WhatsApp
 */
export async function gerarLinkPedido(pedido, total, produtos, observacao) {
  const linhasPedidoPromises = pedido.map(async (item) => {
    const produto = produtos.find((p) => p.id === item.id);
    const corName = await getColorName(item.cor);
    return `*${item.quantidade}x - ${produto.nome}* Cor: ${corName || "Sem Cor"} | Tamanho: ${item.tamanho} - R$ ${produto.preco.toFixed(2)} Uni. `;
  });

  const linhasPedidoArray = await Promise.all(linhasPedidoPromises);
  const linhasPedido = linhasPedidoArray.join("\n");

  const mensagem = `Olá, gostaria de fazer um pedido:\n\n${linhasPedido}\n\nTotal: R$ ${total
    .toFixed(2)
    .replace(".", ",")} ${observacao ? `\n\nObservação: ${observacao}` : ""}`;

  const numero = env.WHATSAPP_NUMBER;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  // return mensagem;
}
