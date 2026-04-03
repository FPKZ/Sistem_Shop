import { NotaVenda, Venda, Cliente, ItemVendido } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function notaVendaRoutes(fastify) {

  fastify.get("/notasVendas", { preHandler: authMiddleware }, async (request, reply) => {
    const notasVenda = await NotaVenda.findAll({
      include: [{
        model: Venda,
        as: "venda",
        include: [
          { model: Cliente, as: "cliente" },
          { model: ItemVendido, as: "itensVendidos" },
        ],
      }],
    });
    return reply.code(200).send(notasVenda);
  });

  fastify.post("/notaVenda", { preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;

    if (!data.venda_id)                                               return reply.err("O ID da venda é obrigatório", 400);
    if (!data.codigo?.trim())                                         return reply.err("O código da nota de venda é obrigatório", 400);
    if (!data.valor_nota || isNaN(data.valor_nota) || Number(data.valor_nota) <= 0) return reply.err("O valor deve ser um número positivo", 400);
    if (!data.forma_pagamento?.trim())                                return reply.err("A forma de pagamento é obrigatória", 400);

    const novaNotaVenda = await NotaVenda.create(data);
    return reply.code(201).ok({ novaNotaVenda }, "Nota de venda criada com sucesso!");
  });

  fastify.put("/notaVenda/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const notaVenda = await NotaVenda.findByPk(request.params.id);
    if (!notaVenda) return reply.err("Nota de venda não encontrada", 404);
    await notaVenda.update(request.body);
    return reply.ok({ notaVenda }, "Nota de venda atualizada com sucesso");
  });

  fastify.delete("/notaVenda/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const notaVenda = await NotaVenda.findByPk(request.params.id);
    if (!notaVenda) return reply.err("Nota de venda não encontrada", 404);
    await notaVenda.destroy();
    return reply.code(204).send();
  });
}