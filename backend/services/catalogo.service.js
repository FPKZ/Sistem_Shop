import { Produto, Categoria, ItemEstoque } from "../database/models/index.js";
import { Op } from "sequelize";
import { isNullOrUndefined } from "../utils/helpers.js";
import { env } from "../config/env.js";

/**
 * Lista os produtos do catálogo público aplicando filtros opcionais.
 * @param {{ categoria?: string, nome?: string }} query
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

  const produtos = await Produto.findAll({
    where,
    include: [
      { model: Categoria, as: "categoria" },
      { model: ItemEstoque, as: "itemEstoque" },
    ],
  });

  return produtos.map((produto) => ({
    id:         produto.id,
    nome:       produto.nome,
    descricao:  produto.descricao,
    categoria:  produto.categoria.nome,
    img:        produto.img,
    preco: produto.itemEstoque.some((item) => item.status === "Disponivel")
      ? Math.max(
          ...produto.itemEstoque
            .filter((item) => item.status === "Disponivel")
            .map((item) => Number(item.valor_venda))
        )
      : 0,
    quantidade: produto.itemEstoque.length,
  }));
}

/**
 * Gera o link do WhatsApp para um pedido.
 * @param {Array<{ id: number, quantidade: number }>} pedido
 * @param {number} total
 * @param {Array} produtos - Produtos carregados do banco
 * @returns {string} URL do WhatsApp
 */
export function gerarLinkPedido(pedido, total, produtos) {
  const linhasPedido = pedido
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.id);
      return `*${produto.nome}* - ${item.quantidade}`;
    })
    .join("\n");

  const mensagem = `Olá, gostaria de fazer um pedido:\n\n${linhasPedido}\n\nTotal: R$ ${total
    .toFixed(2)
    .replace(".", ",")}`;

  const numero = env.WHATSAPP_NUMBER;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
