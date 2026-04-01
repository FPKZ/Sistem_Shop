import { Produto } from "../database/models/index.js";
import { Op } from "sequelize";
import { listarCatalogo, gerarLinkPedido } from "../services/catalogo.service.js";

// Rotas públicas — sem authMiddleware

export default async function catalogoRoutes(fastify) {

  fastify.get("/catalogo", async (request, reply) => {
    const catalogo = await listarCatalogo(request.query);
    return reply.code(200).send(catalogo);
  });

  fastify.post("/pedido", async (request, reply) => {
    const { pedido, total } = request.body;

    const produtos = await listarCatalogo(pedido);

    const url = gerarLinkPedido(pedido, total, produtos);
    return reply.ok({ url });
  });
}