import { listarCatalogo, gerarLinkPedido } from "../services/catalogo.service.js";

// Rotas públicas — sem authMiddleware

export default async function catalogoRoutes(fastify) {

  fastify.get("/catalogo", async (request, reply) => {
    const catalogo = await listarCatalogo(request.query);
    return reply.ok({ data: catalogo });
  });

  fastify.post("/pedido", async (request, reply) => {
    const { pedido, total, observacao } = request.body;

    const produtos = await listarCatalogo(pedido);

    const url = await gerarLinkPedido(pedido, total, produtos, observacao);
    return reply.ok({ url });
  });
}