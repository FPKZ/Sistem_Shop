import { Venda, Cliente, ItemVendido, NotaVenda, ItemEstoque, Produto } from "../database/models/index.js";
import { Op } from "sequelize";
import {
  expirarReservas,
  criarVenda,
  finalizarVenda,
  estornarVenda,
  devolverItens,
} from "../services/venda.service.js";
import { authMiddleware, requireCargo } from "../middlewares/auth.middleware.js";

const INCLUDE_VENDA_COMPLETA = [
  { model: Cliente, as: "cliente" },
  {
    model: ItemVendido,
    as: "itensVendidos",
    include: [{ model: ItemEstoque, as: "itemEstoque", include: [{ model: Produto, as: "produto" }] }],
  },
  { model: NotaVenda, as: "notaVenda" },
];

export default async function vendaRoutes(fastify) {

  fastify.get("/vendas/dashboard", { preHandler: authMiddleware }, async (request, reply) => {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const config = {
      where: { data_venda: { [Op.gte]: seteDiasAtras } },
    }
    const configTodasVendas = {}

    // Se o usuario for vendedor, ele só pode ver suas vendas
    if (request.user.cargo === "vendedor") {
      config.where.vendedor_id = request.user.id;
      configTodasVendas.where = { vendedor_id: request.user.id };
    }

    const [vendas, todasVendas] = await Promise.all([
      Venda.findAll(config),
      Venda.findAll(configTodasVendas),
    ]);

    const stats = {
      totalVendas:        todasVendas.filter((v) => v.status !== "cancelada").length,
      totalReceita:       todasVendas.reduce((acc, v) => ["concluida", "pendente"].includes(v.status) ? acc + (Number(v.valor_total) || 0) : acc, 0),
      vendasConcluidas:   todasVendas.filter((v) => v.status === "concluida").length,
      vendasPendentes:    todasVendas.filter((v) => v.status === "pendente").length,
      devolucoes:         todasVendas.filter((v) => ["devolvida", "estorno"].includes(v.status)).length,
      pagamentosAtrasados: todasVendas.filter((v) => v.status === "atrasado").length,
    };

    const chartDataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      chartDataMap[dateStr] = { name: dateStr, vendas: 0, receita: 0 };
    }

    vendas.forEach((v) => {
      const dateStr = new Date(v.data_venda).toISOString().split("T")[0];
      if (chartDataMap[dateStr]) {
        chartDataMap[dateStr].vendas += 1;
        if (["concluida", "pendente"].includes(v.status)) {
          chartDataMap[dateStr].receita += Number(v.valor_total) || 0;
        }
      }
    });

    return reply.code(200).send({ stats, chartData: Object.values(chartDataMap) });
  });

  fastify.get("/vendas", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      // Expira reservas vencidas de forma assíncrona sem bloquear a resposta principal
      expirarReservas().catch((err) => fastify.log.error("[expirarReservas]", err));
      
      const user = request.user;

      const config = {
        include: INCLUDE_VENDA_COMPLETA,
        order: [["data_venda", "DESC"]],
      }

      if(user.cargo !== "admin"){
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

  fastify.get("/venda/:id", { preHandler: authMiddleware }, async (request, reply) => {
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

  fastify.post("/venda", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      const { vendedor_id } = request.user;
      const novaVenda = await criarVenda(request.body, vendedor_id);
      return reply.code(201).ok({ novaVenda }, "Venda cadastrada com sucesso!");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/finalizar/:id", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user
      
      await finalizarVenda(request.params.id, request.body, user);
      return reply.ok({}, "Venda finalizada com sucesso");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/:id", { preHandler: authMiddleware }, async (request, reply) => {
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

  fastify.delete("/venda/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const venda = await Venda.findByPk(request.params.id);
    if (!venda) return reply.err("Venda não encontrada", 404);
    await venda.destroy();
    return reply.code(204).send();
  });

  fastify.put("/venda/estorno/:id", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      await estornarVenda(request.params.id, user);
      return reply.ok({}, "Estorno realizado com sucesso");
    }catch(error){
      return reply.err(error.message, error.statusCode);
    }
  });

  fastify.put("/venda/devolucao/:id", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      const user = request.user;
      const novaVenda = await devolverItens(request.params.id, request.body, user);
      return reply.ok({ novaVenda }, "Devolução parcial realizada com sucesso!");
    } catch (err) {
      return reply.err(err.message, err.statusCode);
    }
  });
}
