import { Produto, Categoria } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function categoriaRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getCategoriasSchema = {
    description: "Retorna a lista de todas as categorias ativas",
    tags: ["Categorias"]
  };

  const postCategoriaSchema = {
    description: "Cria uma nova categoria no sistema",
    tags: ["Categorias"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["nome"],
      properties: {
        nome: { type: "string", examples: ["Calçados"] },
        descricao: { type: "string", examples: ["Sapatos, tênis e sandálias"] }
      }
    }
  };

  const putCategoriaSchema = {
    description: "Atualiza uma categoria existente por ID",
    tags: ["Categorias"],
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
        nome: { type: "string", examples: ["Roupas"] },
        descricao: { type: "string", examples: ["Camisas e calças masculinas/femininas"] }
      }
    }
  };

  const deleteCategoriaSchema = {
    description: "Remove uma categoria existente do sistema por ID",
    tags: ["Categorias"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  fastify.get("/categorias", { schema: getCategoriasSchema }, async (request, reply) => {
    const categorias = await Categoria.findAll({
      attributes: ["id", "nome", "descricao"],
      order: [["nome", "ASC"]],
    });
    return reply.ok({ data: categorias });
  });

  fastify.post("/categoria", { schema: postCategoriaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;
    const existente = await Categoria.findOne({ where: { nome: data.nome } });
    if (existente) return reply.err("Categoria já existente!", 409);

    const novacategoria = await Categoria.create(data);
    return reply.code(201).ok({ novacategoria }, "Categoria cadastrada com sucesso!");
  });

  fastify.put("/categoria/:id", { schema: putCategoriaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const categoria = await Categoria.findByPk(request.params.id);
    if (!categoria) return reply.err("Categoria não encontrada", 404);
    await categoria.update(request.body);
    return reply.ok({ categoria }, "Categoria atualizada com sucesso");
  });

  fastify.delete("/categoria/:id", { schema: deleteCategoriaSchema, preHandler: authMiddleware }, async (request, reply) => {
    const categoria = await Categoria.findByPk(request.params.id);
    if (!categoria) return reply.err("Categoria não encontrada", 404);
    await categoria.destroy();
    return reply.code(204).send();
  });
}