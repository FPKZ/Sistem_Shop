import { Nota, ItemEstoque } from "../database/models/index.js";
import { cadastrarProduto, toBuffer } from "../services/produto.service.js";
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
    let body = {};
    const imgFiles = {};

    if (request.isMultipart()) {
      const parts = await request.parts();
      for await (const part of parts) {
        if (part.type === "file") {
          imgFiles[part.fieldname] = { buffer: await toBuffer(part.file), filename: part.filename };
        } else {
          body[part.fieldname] = part.value;
        }
      }
    } else {
      body = request.body;
    }

    if (body.itens && typeof body.itens === "string") body.itens = JSON.parse(body.itens);

    const { codigo, valor_total, data, fornecedor, quantidade, data_vencimento } = body;

    const notaExistente = await Nota.findOne({ where: { codigo } });
    if (notaExistente) return reply.err("Nota já cadastrada", 400);

    const novaNota = await Nota.create({ codigo, valor_total, data, data_vencimento, fornecedor, quantidade, status: "pendente" });

    if (!body.itens || body.itens.length === 0) {
      return reply.code(201).ok({ novaNota }, "Nota cadastrada com sucesso!");
    }

    const resultadosCadastro = [];
    for (const produtoData of body.itens) {
      if (produtoData.itens?.length > 0) {
        produtoData.itens.forEach((item) => { item.nota_id = novaNota.id; });
      }
      const imgFile = imgFiles[`imagem_${produtoData.frontId}`];
      resultadosCadastro.push(await cadastrarProduto(produtoData, imgFile));
    }

    return reply.code(201).ok({ nota: novaNota, produtos: resultadosCadastro }, "Nota e produtos cadastrados com sucesso!");
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
