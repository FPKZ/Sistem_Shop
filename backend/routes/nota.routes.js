import { Nota, ItemEstoque } from "../database/models/index.js";
import { cadastrarProduto } from "../services/produto.service.js";
import { verificarVencimentos } from "../services/nota.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function notaRoutes(fastify) {

  fastify.get("/notas", { preHandler: authMiddleware }, async (request, reply) => {
    const notas = await Nota.findAll({
      include: [{ model: ItemEstoque, as: "itensNota" }],
    });

    // Atualiza vencimentos sem bloquear a resposta
    verificarVencimentos(notas).catch((err) => fastify.log.error("[verificarVencimentos]", err));

    return reply.code(200).send(notas);
  });

  fastify.post("/nota", { preHandler: authMiddleware }, async (request, reply) => {
    try {
      let body = request.body;

      if (body.itens && typeof body.itens === "string") body.itens = JSON.parse(body.itens);

      const { codigo, valor_total, data, fornecedor, quantidade, data_vencimento, itens } = body;

      const notaExistente = await Nota.findOne({ where: { codigo } });
      if (notaExistente) throw new Error("Nota já cadastrada");

      const novaNota = await Nota.create({ codigo, valor_total, data, data_vencimento, fornecedor, quantidade, status: "pendente" });

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

  fastify.put("/nota/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const nota = await Nota.findByPk(request.params.id);
    if (!nota) return reply.err("Nota não encontrada", 404);
    await nota.update(request.body);
    return reply.ok({ nota }, "Nota atualizada com sucesso");
  });

  fastify.delete("/nota/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const nota = await Nota.findByPk(request.params.id);
    if (!nota) return reply.err("Nota não encontrada", 404);
    await nota.destroy();
    return reply.code(204).send();
  });
}
