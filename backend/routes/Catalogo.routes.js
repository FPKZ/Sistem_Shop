import { listarCatalogo, gerarLinkPedido } from "../services/catalogo.service.js";

// Rotas públicas — sem authMiddleware

export default async function catalogoRoutes(fastify) {
  const getCatalogoSchema = {
    description: "Lista o catálogo público de produtos disponíveis para venda (sem autenticação)",
    tags: ["Catálogo"],
    querystring: {
      type: "object",
      properties: {
        categoria_id: { type: "number", examples: [1] },
        nome: { type: "string", examples: ["Camiseta"] },
        cor: { type: "string", examples: ["Azul"] },
        tamanho: { type: "string", examples: ["M"] }
      }
    }
  };

  const postPedidoSchema = {
    description: "Gera um link de pedido via WhatsApp com os produtos selecionados pelo cliente",
    tags: ["Catálogo"],
    body: {
      type: "object",
      required: ["pedido", "total"],
      properties: {
        pedido: {
          type: "array",
          description: "Lista de itens selecionados pelo cliente",
          items: {
            type: "object",
            properties: {
              id: { type: "number", examples: [1] },
              quantidade: { type: "number", examples: [2] }
            }
          }
        },
        total: { type: "number", examples: [99.80] },
        observacao: { type: "string", examples: ["Entregar após as 18h"] }
      }
    }
  };

  fastify.get("/catalogo", { schema: getCatalogoSchema }, async (request, reply) => {
    const catalogo = await listarCatalogo(request.query);
    return reply.ok({ data: catalogo });
  });

  fastify.post("/pedido", { schema: postPedidoSchema }, async (request, reply) => {
    const { pedido, total, observacao } = request.body;

    const produtos = await listarCatalogo(pedido);

    const url = await gerarLinkPedido(pedido, total, produtos, observacao);
    return reply.ok({ url });
  });
}