import { Produto, Categoria } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function categoriaRoutes(fastify) {

  fastify.get("/categorias", async (request, reply) => {
    const categorias = await Categoria.findAll({
      attributes: ["id", "nome", "descricao"],
    });
    return reply.ok({ data: categorias });
  });

  fastify.post("/categoria", { preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;
    const existente = await Categoria.findOne({ where: { nome: data.nome } });
    if (existente) return reply.err("Categoria já existente!", 409);

    const novacategoria = await Categoria.create(data);
    return reply.code(201).ok({ novacategoria }, "Categoria cadastrada com sucesso!");
  });

  fastify.put("/categoria/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const categoria = await Categoria.findByPk(request.params.id);
    if (!categoria) return reply.err("Categoria não encontrada", 404);
    await categoria.update(request.body);
    return reply.ok({ categoria }, "Categoria atualizada com sucesso");
  });

  fastify.delete("/categoria/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const categoria = await Categoria.findByPk(request.params.id);
    if (!categoria) return reply.err("Categoria não encontrada", 404);
    await categoria.destroy();
    return reply.code(204).send();
  });
}