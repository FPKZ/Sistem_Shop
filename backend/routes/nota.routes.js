import { Nota, ItemEstoque } from "../database/models/index.js";
import { cadastrarProduto } from "../services/produto.service.js";
import { verificarVencimentos } from "../services/nota.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function notaRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getNotasSchema = {
    description: "Lista todas as notas fiscais recebidas com seus itens de estoque vinculados",
    tags: ["Notas Fiscais"],
    security: [{ BearerAuth: [] }]
  };

  const postNotaSchema = {
    description: "Cadastra uma nova nota fiscal e realiza a entrada em lote dos produtos descritos nela",
    tags: ["Notas Fiscais"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["codigo", "valor_total"],
      properties: {
        codigo: { type: "string", examples: ["NF-998877"] },
        valor_total: { type: "number", examples: [1500.50] },
        data: { type: "string", format: "date", examples: ["2026-05-26"] },
        data_vencimento: { type: "string", format: "date", examples: ["2026-06-26"] },
        fornecedor: { type: "string", examples: ["Distribuidora de Roupas LTDA"] },
        quantidade: { type: "number", examples: [50] },
        itens: {
          type: "array",
          description: "Lista de produtos e itens inclusos na nota fiscal (pode ser enviado como string JSON)",
          items: {
            type: "object",
            properties: {
              nome: { type: "string", examples: ["Camiseta Polo"] },
              descricao: { type: "string", examples: ["Camiseta algodão polo"] },
              categoria_id: { type: "number", examples: [1] },
              itens: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    tamanho: { type: "string", examples: ["M"] },
                    cor: { type: "string", examples: ["Azul"] },
                    marca: { type: "string", examples: ["Hering"] },
                    codigo_barras: { type: "string", examples: ["7891234567890"] },
                    valor_compra: { type: "number", examples: [20.00] },
                    valor_venda: { type: "number", examples: [49.90] },
                    lucro: { type: "number", examples: [29.90] },
                    status: { type: "string", examples: ["Disponível"] }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const putNotaSchema = {
    description: "Atualiza os dados de uma nota fiscal existente por ID",
    tags: ["Notas Fiscais"],
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
        codigo: { type: "string", examples: ["NF-998877B"] },
        valor_total: { type: "number", examples: [1600.00] },
        data: { type: "string", format: "date", examples: ["2026-05-26"] },
        data_vencimento: { type: "string", format: "date", examples: ["2026-07-26"] },
        fornecedor: { type: "string", examples: ["Distribuidora Nova Roupas LTDA"] },
        quantidade: { type: "number", examples: [55] }
      }
    }
  };

  const deleteNotaSchema = {
    description: "Remove uma nota fiscal do sistema por ID",
    tags: ["Notas Fiscais"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  fastify.get("/notas", { schema: getNotasSchema, preHandler: authMiddleware }, async (request, reply) => {
    const notas = await Nota.findAll({
      include: [{ model: ItemEstoque, as: "itensNota" }],
    });

    // Atualiza vencimentos sem bloquear a resposta
    verificarVencimentos(notas).catch((err) => fastify.log.error("[verificarVencimentos]", err));

    return reply.code(200).send(notas);
  });

  fastify.post("/nota", { schema: postNotaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try {
      let body = request.body;

      if (body.itens && typeof body.itens === "string") body.itens = JSON.parse(body.itens);

      const { codigo, valor_total, data, fornecedor, quantidade, data_vencimento, itens } = body;

      const notaExistente = await Nota.findOne({ where: { codigo } });
      if (notaExistente) throw new Error("Nota já cadastrada");

      const novaNota = await Nota.create({ codigo, valor_total, data, data_vencimento, fornecedor, quantidade: quantidade, status: "pendente" });

      if (!itens || itens.length === 0) {
        return reply.code(201).ok({ novaNota }, "Nota cadastrada com sucesso!");
      }

      const resultadosCadastro = [];
      for (const produtoData of itens) {
        if (produtoData.itens?.length > 0) {
          produtoData.itens.forEach((item) => { item.nota_id = novaNota.id; });
        }
        resultadosCadastro.push(await cadastrarProduto(produtoData));
      }

      return reply.code(201).ok({ nota: novaNota, produtos: resultadosCadastro }, "Nota e produtos cadastrados com sucesso!");
    } catch (err) {
      reply.err(err)
    }
  });

  fastify.put("/nota/:id", { schema: putNotaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const nota = await Nota.findByPk(request.params.id);
    if (!nota) return reply.err("Nota não encontrada", 404);
    await nota.update(request.body);
    return reply.ok({ nota }, "Nota atualizada com sucesso");
  });

  fastify.delete("/nota/:id", { schema: deleteNotaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const nota = await Nota.findByPk(request.params.id);
    if (!nota) return reply.err("Nota não encontrada", 404);
    await nota.destroy();
    return reply.code(204).send();
  });
}
