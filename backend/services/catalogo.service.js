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
    // iLike = case-insensitive para PostgreSQL
    where.nome = { [Op.iLike]: `%${query.nome}%` };
  }

  if (!isNullOrUndefined(query.id)) {
    where.id = query.id;
  }

  const produtos = await Produto.findAll({
    where,
    attributes: ["id", "nome", "descricao", "imgs"],
    include: [
      { model: Categoria, as: "categoria", attributes: ["id", "nome"] },
      {
        model: ItemEstoque,
        as: "itemEstoque",
        attributes: ["id", "status", "cor", "tamanho", "valor_venda"],
      },
    ],
  });


  const quantidadeDisponivel = async (produto) => {
    const disponiveis = produto.itemEstoque.filter((item) => item.status === "Disponivel");
    return disponiveis.length > 0 ? disponiveis.length : "Esgotado";
  }

  const data = await Promise.all(produtos.map(async (produto) => ({
    id:         produto.id,
    nome:       produto.nome,
    descricao:  produto.descricao,
    categoria:  produto.categoria.nome,
    imgs:       produto.imgs,
    cores: await getColorsList([...new Set(produto.itemEstoque.map((item) => item.status === "Disponivel" ? item.cor : null))].sort()),
    preco: produto.itemEstoque.some((item) => item.status === "Disponivel")
      ? Math.max(
          ...produto.itemEstoque
            .filter((item) => item.status === "Disponivel")
            .map((item) => Number(item.valor_venda))
        )
      : 0,
    quantidade: await quantidadeDisponivel(produto),
    tamanho: [...new Set(produto.itemEstoque.map((item) => item.status === "Disponivel" ? item.tamanho : null))].filter((item) => item !== "" && item !== null).sort()
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
