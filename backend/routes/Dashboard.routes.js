import {
  Venda,
  ItemEstoque,
  Nota,
  Produto,
  ItemVendido,
} from "../database/models/index.js";
import { Op } from "sequelize";

export default async function dashboardRoutes(fastify) {
  fastify.get("/dashboard", async (request, reply) => {
    try {
      const hoje = new Date();
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

      const proximoVencimento = new Date();
      proximoVencimento.setDate(proximoVencimento.getDate() + 7);

      const [vendasRecentes, todasVendas, todasNotas, todosItensEstoque] = await Promise.all([
        Venda.findAll({
          where: { data_venda: { [Op.gte]: trintaDiasAtras } },
          include: [{ model: ItemVendido, as: "itensVendidos", include: [{ model: ItemEstoque, as: "itemEstoque" }] }]
        }),
        Venda.findAll({
          include: [{ model: ItemVendido, as: "itensVendidos", include: [{ model: ItemEstoque, as: "itemEstoque" }] }]
        }),
        Nota.findAll({
          where: { status: "pendente" },
          include: [{ model: ItemEstoque, as: "itensNota" }]
        }),
        ItemEstoque.findAll({
          where: { status: "Disponivel" },
          include: [{ model: Produto, as: "produto" }]
        })
      ]);

      // 1. Estatísticas de Vendas e Lucro
      const stats = {
        totalVendas: todasVendas.filter((v) => v.status !== "cancelada").length,
        receitaTotal: 0,
        lucroTotal: 0,
        vendasConcluidas: 0,
        vendasPendentes: 0,
        pagamentosAtrasados: 0,
      };

      todasVendas.forEach(v => {
        if (["concluida", "pendente"].includes(v.status)) {
          const valorVenda = Number(v.valor_total) || 0;
          stats.receitaTotal += valorVenda;
          
          let custoVenda = 0;
          v.itensVendidos?.forEach(item => {
            custoVenda += Number(item.itemEstoque?.valor_compra) || 0;
          });
          stats.lucroTotal += (valorVenda - custoVenda);
        }
        if (v.status === "concluida") stats.vendasConcluidas++;
        if (v.status === "pendente") stats.vendasPendentes++;
        if (v.status === "atrasado") stats.pagamentosAtrasados++;
      });

      // 2. Gráfico de Vendas (30 dias)
      const chartDataMap = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        chartDataMap[dateStr] = { name: dateStr, vendas: 0, receita: 0, lucro: 0 };
      }

      vendasRecentes.forEach((v) => {
        const dateStr = new Date(v.data_venda).toISOString().split("T")[0];
        if (chartDataMap[dateStr]) {
          chartDataMap[dateStr].vendas += 1;
          if (["concluida", "pendente"].includes(v.status)) {
            const valorVenda = Number(v.valor_total) || 0;
            chartDataMap[dateStr].receita += valorVenda;

            let custoVenda = 0;
            v.itensVendidos?.forEach(item => {
               custoVenda += Number(item.itemEstoque?.valor_compra) || 0;
            });
            chartDataMap[dateStr].lucro += (valorVenda - custoVenda);
          }
        }
      });

      // 3. Alertas de Estoque Baixo
      // Agrupar itens por produto para contar estoque real
      const estoquePorProduto = {};
      todosItensEstoque.forEach(item => {
        const pId = item.produto_id;
        if (!estoquePorProduto[pId]) {
          estoquePorProduto[pId] = {
            id: pId,
            nome: item.produto?.nome,
            quantidade: 0,
            img: item.produto?.img
          };
        }
        estoquePorProduto[pId].quantidade++;
      });

      const estoqueBaixo = Object.values(estoquePorProduto)
        .filter(p => p.quantidade < 5)
        .sort((a, b) => a.quantidade - b.quantidade);

      // 4. Alertas de Vencimento de Notas
      const notasVencendo = todasNotas.map(nota => {
        const vencimento = new Date(nota.data_vencimento);
        const diasParaVencer = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
        return {
          id: nota.id,
          codigo: nota.codigo,
          fornecedor: nota.fornecedor,
          valor: nota.valor_total,
          data_vencimento: nota.data_vencimento,
          diasParaVencer
        };
      }).filter(n => n.diasParaVencer <= 7)
        .sort((a, b) => a.diasParaVencer - b.diasParaVencer);

      reply.code(200).send({
        stats,
        chartData: Object.values(chartDataMap),
        estoqueBaixo,
        notasVencendo,
        ok: true
      });

    } catch (err) {
      console.error(err);
      reply.code(500).send({ message: "Erro ao gerar dashboard consolidado", ok: false });
    }
  });
}
