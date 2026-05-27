import { NotaVenda, Venda, Cliente, ItemVendido } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function notaVendaRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getNotasVendasSchema = {
    description: "Lista todas as notas de venda geradas, com detalhes do cliente e itens vendidos",
    tags: ["Notas de Venda"],
    security: [{ BearerAuth: [] }]
  };

  const postNotaVendaSchema = {
    description: "Cria uma nova nota de venda vinculada a uma venda já existente",
    tags: ["Notas de Venda"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["venda_id", "codigo", "valor_nota", "forma_pagamento"],
      properties: {
        venda_id: { type: "number", examples: [1] },
        codigo: { type: "string", examples: ["NV-2026-001"] },
        valor_nota: { type: "number", examples: [149.90] },
        forma_pagamento: { type: "string", examples: ["Pix"] },
        parcelas: { type: "number", examples: [1] },
        observacoes: { type: "string", examples: ["Venda realizada sem trocas"] }
      }
    }
  };

  const putNotaVendaSchema = {
    description: "Atualiza os dados de uma nota de venda existente por ID",
    tags: ["Notas de Venda"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    },
    body: {
      type: "object",
      properties: {
        codigo: { type: "string", examples: ["NV-2026-002"] },
        valor_nota: { type: "number", examples: [200.00] },
        forma_pagamento: { type: "string", examples: ["Cartão de Crédito"] },
        parcelas: { type: "number", examples: [2] },
        observacoes: { type: "string", examples: ["Pagamento parcelado"] }
      }
    }
  };

  const deleteNotaVendaSchema = {
    description: "Remove uma nota de venda do sistema por ID",
    tags: ["Notas de Venda"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  fastify.get("/notasVendas", { schema: getNotasVendasSchema, preHandler: authMiddleware }, async (request, reply) => {
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

  fastify.post("/notaVenda", { schema: postNotaVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;

    if (!data.venda_id)                                               return reply.err("O ID da venda é obrigatório", 400);
    if (!data.codigo?.trim())                                         return reply.err("O código da nota de venda é obrigatório", 400);
    if (!data.valor_nota || isNaN(data.valor_nota) || Number(data.valor_nota) <= 0) return reply.err("O valor deve ser um número positivo", 400);
    if (!data.forma_pagamento?.trim())                                return reply.err("A forma de pagamento é obrigatória", 400);

    const novaNotaVenda = await NotaVenda.create(data);
    return reply.code(201).ok({ novaNotaVenda }, "Nota de venda criada com sucesso!");
  });

  fastify.put("/notaVenda/:id", { schema: putNotaVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const notaVenda = await NotaVenda.findByPk(request.params.id);
    if (!notaVenda) return reply.err("Nota de venda não encontrada", 404);
    await notaVenda.update(request.body);
    return reply.ok({ notaVenda }, "Nota de venda atualizada com sucesso");
  });

  fastify.delete("/notaVenda/:id", { schema: deleteNotaVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const notaVenda = await NotaVenda.findByPk(request.params.id);
    if (!notaVenda) return reply.err("Nota de venda não encontrada", 404);
    await notaVenda.destroy();
    return reply.code(204).send();
  });
}