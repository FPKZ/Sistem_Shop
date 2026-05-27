import { Venda, Cliente, ItemVendido, NotaVenda, ItemEstoque, Produto, Conta } from "../database/models/index.js";
import { Op } from "sequelize";
import {
  expirarReservas,
  criarVenda,
  finalizarVenda,
  estornarVenda,
  devolverItens,
  DashboardVendas
} from "../services/venda.service.js";
import { authMiddleware, requireCargo } from "../middlewares/auth.middleware.js";

const INCLUDE_VENDA_COMPLETA = [
  { model: Cliente, as: "cliente" },
  { model: Conta, as: "vendedor", attributes: ["nome"] },
  {
    model: ItemVendido,
    as: "itensVendidos",
    include: [{ model: ItemEstoque, as: "itemEstoque", include: [{ model: Produto, as: "produto" }] }],
  },
  { model: NotaVenda, as: "notaVenda" },
];

export default async function vendaRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getVendasDashboardSchema = {
    description: "Retorna estatísticas detalhadas de vendas para renderização de gráficos no dashboard",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }]
  };

  const getVendasSchema = {
    description: "Lista todas as vendas realizadas. Vendedores comuns visualizam apenas as próprias vendas",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }]
  };

  const getVendaByIdSchema = {
    description: "Busca os detalhes completos de uma venda específica por ID",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  const postVendaSchema = {
    description: "Registra uma nova venda, decrementando ou reservando itens de estoque conforme o fluxo",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["itens"],
      properties: {
        cliente_id: { type: "number", examples: [1] },
        desconto: { type: "number", examples: [10.00] },
        acrescimo: { type: "number", examples: [0.00] },
        forma_pagamento: { type: "string", examples: ["Dinheiro"] },
        status: { type: "string", examples: ["Pendente", "Finalizada"] },
        parcelas: { type: "number", examples: [1] },
        itens: {
          type: "array",
          items: {
            type: "object",
            required: ["itemEstoque_id", "valor_venda"],
            properties: {
              itemEstoque_id: { type: "number", examples: [1] },
              valor_venda: { type: "number", examples: [49.90] }
            }
          }
        }
      }
    }
  };

  const finalizarVendaSchema = {
    description: "Finaliza uma venda pendente definindo a forma de pagamento e faturamento",
    tags: ["Vendas"],
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
        forma_pagamento: { type: "string", examples: ["Cartão de Crédito"] },
        parcelas: { type: "number", examples: [3] }
      }
    }
  };

  const putVendaSchema = {
    description: "Atualiza os dados de uma venda por ID",
    tags: ["Vendas"],
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
        desconto: { type: "number", examples: [15.00] },
        forma_pagamento: { type: "string", examples: ["Pix"] }
      }
    }
  };

  const deleteVendaSchema = {
    description: "Exclui uma venda do sistema (Apenas Admin)",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  const estornoVendaSchema = {
    description: "Realiza o estorno de uma venda e devolve os itens ao estoque original",
    tags: ["Vendas"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  const devolucaoVendaSchema = {
    description: "Realiza a devolução parcial ou total de itens de uma venda específica",
    tags: ["Vendas"],
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
      required: ["itens"],
      properties: {
        itens: {
          type: "array",
          items: {
            type: "object",
            required: ["itemVendido_id", "quantidade"],
            properties: {
              itemVendido_id: { type: "number", examples: [1] },
              quantidade: { type: "number", examples: [1] }
            }
          }
        }
      }
    }
  };

  fastify.get("/vendas/dashboard", { schema: getVendasDashboardSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      const {stats, chartData} = await DashboardVendas(user);
      return reply.code(200).send({ stats, chartData });
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.get("/vendas", { schema: getVendasSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      // Expira reservas vencidas de forma assíncrona sem bloquear a resposta principal
      expirarReservas().catch((err) => fastify.log.error("[expirarReservas]", err));
      
      const user = request.user;

      const config = {
        include: INCLUDE_VENDA_COMPLETA,
        order: [["data_venda", "DESC"]],
      }

      if(user.cargo === "vendedor"){
        config.where = {
          vendedor_id: user.id,
        }
      }
      const vendas = await Venda.findAll(config);

      return reply.code(200).send(vendas); 
    } catch (err) {
      return reply.err(err.message, err.statusCode);
    }
   
  });

  fastify.get("/venda/:id", { schema: getVendaByIdSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      const venda = await Venda.findByPk(request.params.id, { include: INCLUDE_VENDA_COMPLETA });
      if (!venda) return reply.err("Venda não encontrada", 404);
      if(user.cargo !== "admin"){
        if(venda.vendedor_id !== user.id) return reply.err("Você não tem permissão para acessar esta venda", 403);
      }
      return reply.code(200).send(venda);
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.post("/venda", { schema: postVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const { id } = request.user;
      const novaVenda = await criarVenda(request.body, id);
      return reply.code(201).ok({ novaVenda }, "Venda cadastrada com sucesso!");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/finalizar/:id", { schema: finalizarVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user
      
      await finalizarVenda(request.params.id, request.body, user);
      return reply.ok({}, "Venda finalizada com sucesso");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/:id", { schema: putVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      const venda = await Venda.findByPk(request.params.id);
      if (!venda) return reply.err("Venda não encontrada", 404);
      if(user.cargo !== "admin"){
        if(venda.vendedor_id !== user.id) return reply.err("Você não tem permissão para atualizar esta venda", 403);
      }
      await venda.update(request.body);
      return reply.ok({ venda }, "Venda atualizada com sucesso");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.delete("/venda/:id", { schema: deleteVendaSchema, preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const venda = await Venda.findByPk(request.params.id);
    if (!venda) return reply.err("Venda não encontrada", 404);
    await venda.destroy();
    return reply.code(204).send();
  });

  fastify.put("/venda/estorno/:id", { schema: estornoVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      await estornarVenda(request.params.id, user);
      return reply.ok({}, "Estorno realizado com sucesso");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/devolucao/:id", { schema: devolucaoVendaSchema, preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      const novaVenda = await devolverItens(request.params.id, request.body, user);
      return reply.ok({ novaVenda }, "Devolução parcial realizada com sucesso!");
    } catch (err) {
      return reply.err(err.message, err.statusCode);
    }
  });
}
