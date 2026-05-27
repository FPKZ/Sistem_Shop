import {
  Produto,
  ItemEstoque,
  Cliente,
  ItemReservado,
} from "../database/models/index.js";
import { cadastrarProduto, buscarProdutos } from "../services/produto.service.js";
import { authMiddleware, requireCargo } from "../middlewares/auth.middleware.js";


export default async function produtoRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getProdutosSchema = {
    description: "Lista produtos do sistema com opções de filtro por nome, id ou status dos itens",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    querystring: {
      type: "object",
      properties: {
        id: { type: "number", description: "ID de um produto específico para buscar", examples: [1] },
        nome: { type: "string", description: "Nome para buscar via aproximação (Like)", examples: ["Camiseta"] },
        itens: {
          type: "string",
          enum: ["all", "vendidos", "estoque", "reservado", "none"],
          description: "Filtro pelo status/situação dos itens de estoque associados",
          examples: ["estoque"]
        }
      }
    }
  };

  const postProdutoSchema = {
    description: "Cadastra um produto e adiciona itens ao estoque",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["nome", "descricao", "categoria_id"],
      properties: {
        nome: { type: "string", examples: ["Camiseta Polo Masculina"] },
        descricao: { type: "string", examples: ["Camiseta polo em algodão confortável"] },
        categoria_id: { type: "number", examples: [1] },
        imgs: { type: "array", items: { type: "string" }, examples: [["https://url-imagem.com/img1.jpg"]] },
        itens: {
          type: "array",
          description: "Lista de itens físicos desse produto a serem criados no estoque (pode ser enviado como string JSON)",
          items: {
            type: "object",
            properties: {
              nota_id: { type: "number", examples: [1] },
              tamanho: { type: "string", examples: ["M"] },
              cor: { type: "string", examples: ["Preto"] },
              marca: { type: "string", examples: ["Hering"] },
              codigo_barras: { type: "string", examples: ["7891011121314"] },
              valor_compra: { type: "number", examples: [25.00] },
              valor_venda: { type: "number", examples: [59.90] },
              lucro: { type: "number", examples: [34.90] }
            }
          }
        }
      }
    }
  };

  const putSchemaProduto = {
    description: "Atualiza os metadados de um produto (como nome, descrição e imagens)",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        nome: { type: "string", examples: ["Camiseta Polo Nova"] },
        img: { type: "string", examples: ["https://url-imagem.com/nova-principal.jpg"] },
        imgs: { type: "array", items: { type: "string" }, examples: [["https://url-imagem.com/img1.jpg", "https://url-imagem.com/img2.jpg"]] },
        descricao: { type: "string", examples: ["Descrição atualizada da camiseta polo"] },
        categoria_id: { type: "number", examples: [1] },
      },
    },
    params: {
      type: "object",
      properties: {
        id: { type: "number", examples: [1] }
      },
      required: ["id"]
    }
  };

  const putSchemaItem = {
    description: "Atualiza os atributos de um item de estoque específico (tamanho, cor, valores, status)",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        tamanho: { type: "string", examples: ["G"] }, 
        cor: { type: "string", examples: ["Preto"] },
        marca: { type: "string", examples: ["Hering"] },
        codigo_barras: { type: "string", examples: ["7891011121314"] },
        valor_compra: { type: "number", examples: [27.00] },
        valor_venda: { type: "number", examples: [64.90] },
        lucro: { type: "number", examples: [37.90] },
        status: { type: "string", examples: ["Disponivel"] },
      },
    },
    params: {
      type: "object",
      properties: {
        id: { type: "number", examples: [1] }
      },
      required: ["id"]
    }
  };

  const putReservarProdutoSchema = {
    description: "Reserva um item do estoque para um cliente específico",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    },
    querystring: {
      type: "object",
      required: ["cliente_id"],
      properties: {
        cliente_id: { type: "number", examples: [1] }
      }
    }
  };

  const putRemoverReservaProdutoSchema = {
    description: "Remove a reserva de um item e atualiza os dados do item de estoque",
    tags: ["Produtos"],
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
        status: { type: "string", examples: ["Disponivel"] }
      }
    }
  };

  const deleteProdutoSchema = {
    description: "Exclui um produto (metadados do produto) por ID",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  const deleteItemEstoqueSchema = {
    description: "Exclui um item de estoque específico por ID",
    tags: ["Produtos"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  // --- Leitura ---
  fastify.get("/produtos", { schema: getProdutosSchema, preHandler: authMiddleware }, async (request, reply) => {
    const produtos = await buscarProdutos(request.query)
    return reply.code(200).send(produtos);
  });

  // --- Criação ---
  fastify.post("/produto", { schema: postProdutoSchema, preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
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
  fastify.put("/produto/reservar/:id", { schema: putReservarProdutoSchema, preHandler: [authMiddleware, requireCargo("admin", "gerente", "vendedor")] }, async (request, reply) => {
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

  fastify.put("/produto/remover/:id", { schema: putRemoverReservaProdutoSchema, preHandler: authMiddleware }, async (request, reply) => {
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
  fastify.delete("/produto/:id", { schema: deleteProdutoSchema, preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    const produto = await Produto.findByPk(request.params.id);
    if (!produto) return reply.err("Produto não encontrado", 404);
    await produto.destroy();
    return reply.code(204).send();
  });

  fastify.delete("/produto/item/:id", { schema: deleteItemEstoqueSchema, preHandler: [authMiddleware, requireCargo("admin", "gerente")] }, async (request, reply) => {
    const item = await ItemEstoque.findByPk(request.params.id);
    if (!item) return reply.err("Item não encontrado", 404);
    await item.destroy();
    return reply.code(204).send();
  });
}
