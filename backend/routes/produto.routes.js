import {
  Produto,
  Categoria,
  Nota,
  ItemEstoque,
  Cliente,
  ItemReservado,
} from "../database/models/index.js";
import { Op } from "sequelize";
import { cadastrarProduto } from "../services/produto.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const INCLUDE_PRODUTO_COM_CATEGORIA = [
  { model: Categoria, as: "categoria" },
];

const INCLUDE_ITEM_ESTOQUE_COMPLETO = [
  { model: Categoria, as: "categoria" },
  { model: ItemEstoque, as: "itemEstoque", include: [{ model: Nota, as: "nota" }] },
];

const INCLUDE_ITEM_COM_PRODUTO = [
  { model: Nota, as: "nota" },
  { model: Produto, as: "produto", include: [{ model: Categoria, as: "categoria" }] },
];

export default async function produtoRoutes(fastify) {

  // --- Leitura ---
  fastify.get("/produtos", { preHandler: authMiddleware }, async (request, reply) => {
    const { itens, nome } = request.query;

    if (itens === "all") {
      const produtos = await ItemEstoque.findAll({ include: INCLUDE_ITEM_COM_PRODUTO });
      return reply.code(200).send(produtos);
    }

    if (itens === "vendidos") {
      const produtos = await ItemEstoque.findAll({ where: { status: "Vendido" }, include: INCLUDE_ITEM_COM_PRODUTO });
      return reply.code(200).send(produtos);
    }

    if (itens === "estoque") {
      const produtos = await Produto.findAll({
        include: [
          ...INCLUDE_PRODUTO_COM_CATEGORIA,
          { model: ItemEstoque, as: "itemEstoque", where: { status: "Disponivel" }, include: [{ model: Nota, as: "nota" }] },
        ],
      });
      return reply.code(200).send(produtos);
    }

    if (itens === "reservado") {
      const produtos = await ItemEstoque.findAll({ where: { status: "Reservado" }, include: INCLUDE_ITEM_COM_PRODUTO });
      return reply.code(200).send(produtos);
    }

    const where = nome && nome !== " " ? { nome: { [Op.like]: `%${nome}%` } } : {};
    const produtos = await Produto.findAll({ where, include: INCLUDE_ITEM_ESTOQUE_COMPLETO });
    return reply.code(200).send(produtos);
  });

  // --- Criação ---
  fastify.post("/produto", { preHandler: authMiddleware }, async (request, reply) => {
    try {
      let body = request.body

      if (body.itens && typeof body.itens === "string") body.itens = JSON.parse(body.itens);

      const result = await cadastrarProduto(body);
      return reply.ok({ data: result, message: "Estoque atualizado com sucesso!" });
    } catch (err) {
      reply.err(err)
    }
  });

  // --- Reserva / Remoção ---
  fastify.put("/produto/reservar/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params;
    const { cliente_id } = request.query;

    const [produto, cliente] = await Promise.all([
      ItemEstoque.findByPk(id),
      Cliente.findByPk(cliente_id),
    ]);

    if (!produto) return reply.err("Produto não encontrado", 404);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await ItemReservado.create({ cliente_id, itemEstoque_id: id, data: new Date() });
    await produto.update({ status: "Reservado" });
    return reply.ok({ produto }, "Produto reservado com sucesso");
  });

  fastify.put("/produto/remover/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params;
    const [item, itemReservado] = await Promise.all([
      ItemEstoque.findByPk(id),
      ItemReservado.findOne({ where: { itemEstoque_id: id } }),
    ]);

    if (!item) return reply.err("Item não encontrado", 404);
    if (!itemReservado) return reply.err("Item reservado não encontrado", 404);

    await itemReservado.destroy();
    await item.update(request.body);
    return reply.ok({ item }, "Item atualizado com sucesso");
  });

  // --- Atualização ---
  fastify.put("/produto/item/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const item = await ItemEstoque.findByPk(request.params.id);
    if (!item) return reply.err("Item não encontrado", 404);
    await item.update(request.body);
    return reply.ok({ item }, "Item atualizado com sucesso");
  });

  fastify.put("/produto/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const produto = await Produto.findByPk(request.params.id);
    if (!produto) return reply.err("Produto não encontrado", 404);
    await produto.update(request.body);
    return reply.ok({ produto }, "Produto atualizado com sucesso");
  });

  // --- Exclusão ---
  fastify.delete("/produto/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const produto = await Produto.findByPk(request.params.id);
    if (!produto) return reply.err("Produto não encontrado", 404);
    await produto.destroy();
    return reply.code(204).send();
  });

  fastify.delete("/produto/item/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const item = await ItemEstoque.findByPk(request.params.id);
    if (!item) return reply.err("Item não encontrado", 404);
    await item.destroy();
    return reply.code(204).send();
  });
}
