import {
  Produto,
  ItemEstoque,
  Cliente,
  ItemReservado,
} from "../database/models/index.js";
import { cadastrarProduto, buscarProdutos } from "../services/produto.service.js";
import { authMiddleware, requireCargo } from "../middlewares/auth.middleware.js";


const putSchemaProduto = {
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      nome: { type: "string" },
      img: { type: "string" },
      imgs: { type: "array", items: { type: "string" } },
      descricao: { type: "string" },
      categoria_id: { type: "number" },
    },
  },
  params: {
    type: "object",
    properties: {
      id: { type: "number" }
    },
    required: ["id"]
  }
}

const putSchemaItem = {
    body: {
      type: "object",
      //bloqueia campos que não estão definidos abaixo
      additionalProperties: false,
      properties: {
        tamanho: { type: "string" }, 
        cor: { type: "string" }, // nome: "Azul", hex: "#000000"
        marca: { type: "string" },
        codigo_barras: { type: "string" },
        valor_compra: { type: "number" },
        valor_venda: { type: "number" },
        lucro: { type: "number" },
        status: { type: "string" },
      },
      // required: ["nome"]
    },
    params: {
      type: "object",
      properties: {
        id: { type: "number" }
      },
      required: ["id"]
    }
  }

export default async function produtoRoutes(fastify) {

  // --- Leitura ---
  fastify.get("/produtos", { preHandler: authMiddleware }, async (request, reply) => {
    const produtos = await buscarProdutos(request.query)
    return reply.code(200).send(produtos);
  });

  // --- Criação ---
  fastify.post("/produto", { preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    try {
      let body = request.body

      if (body.itens && typeof body.itens === "string") body.itens = JSON.parse(body.itens);

      const result = await cadastrarProduto(body);
      return reply.ok({ data: result, message: "Estoque atualizado com sucesso!" });
    } catch (err) {
      reply.err(err)
    }
  });

  // --- Atualizar Produto ---
  fastify.put("/produto/:id", { schema: putSchemaProduto, preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    try {
      const { id } = request.params;

      if(!id) throw new Error("ID do produto não fornecido", 400)

      const produto = await Produto.findByPk(id);
      if (!produto) return reply.err("Produto não encontrado", 404);

      await produto.update(request.body);
      
      return reply.ok({ produto }, "Produto atualizado com sucesso");
    } catch (err) {
      reply.err(err)
    }
  });

  // --- Atualizar ItemEstoque ---
  fastify.put("/produto/item/:id", { schema: putSchemaItem, preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    try{
      const { id } = request.params;

      if(!id) throw new Error("ID do item não fornecido", 400)
      
      const item = await ItemEstoque.findByPk(id);
      
      if (!item) return reply.err("Item não encontrado", 404);
      
      await item.update(request.body);
      
      return reply.ok({ message: `Produto ${item.nome} atualizado com sucesso`})
    } catch (err) {
      return reply.err(err)
    }
  })

  // --- Reserva / Remoção ---
  fastify.put("/produto/reservar/:id", { preHandler: [authMiddleware, requireCargo("admin", "gerente", "vendedor")] }, async (request, reply) => {
    const { id } = request.params;
    const { cliente_id } = request.query;

    const [produto, cliente] = await Promise.all([
      ItemEstoque.findByPk(id),
      Cliente.findByPk(cliente_id),
    ]);

    if (!produto) return reply.err("Produto não encontrado", 404);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await ItemReservado.create({ cliente_id, itemEstoque_id: id, data: new Date() });
    await produto.update({ status: "Reservado" });
    return reply.ok({ produto }, "Produto reservado com sucesso");
  });

  fastify.put("/produto/remover/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params;
    const [item, itemReservado] = await Promise.all([
      ItemEstoque.findByPk(id),
      ItemReservado.findOne({ where: { itemEstoque_id: id } }),
    ]);

    if (!item) return reply.err("Item não encontrado", 404);
    if (!itemReservado) return reply.err("Item reservado não encontrado", 404);

    await itemReservado.destroy();
    await item.update(request.body);
    return reply.ok({ item }, "Item atualizado com sucesso");
  });

  // --- Exclusão ---
  fastify.delete("/produto/:id", { preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    const produto = await Produto.findByPk(request.params.id);
    if (!produto) return reply.err("Produto não encontrado", 404);
    await produto.destroy();
    return reply.code(204).send();
  });

  fastify.delete("/produto/item/:id", { preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    const item = await ItemEstoque.findByPk(request.params.id);
    if (!item) return reply.err("Item não encontrado", 404);
    await item.destroy();
    return reply.code(204).send();
  });
}
