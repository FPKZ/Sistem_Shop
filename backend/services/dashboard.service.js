import { Venda, ItemEstoque, Nota, Produto, ItemVendido } from "../database/models/index.js";
import { Op } from "sequelize";
import { toISODate, diasAte } from "../utils/helpers.js";

const LIMITE_ESTOQUE_BAIXO = 5;
const DIAS_ALERTA_VENCIMENTO = 7;

/**
 * Calcula as estatísticas gerais das vendas.
 * @param {Venda[]} todasVendas
 * @returns {object}
 */
function calcularStats(todasVendas) {
  const stats = {
    totalVendas:        todasVendas.filter((v) => v.status !== "cancelada").length,
    receitaTotal:       0,
    lucroTotal:         0,
    vendasConcluidas:   0,
    vendasPendentes:    0,
    pagamentosAtrasados: 0,
  };

  todasVendas.forEach((v) => {
    if (["concluida", "pendente"].includes(v.status)) {
      const valorVenda = Number(v.valor_total) || 0;
      stats.receitaTotal += valorVenda;

      const custoVenda = v.itensVendidos?.reduce(
        (acc, item) => acc + (Number(item.itemEstoque?.valor_compra) || 0),
        0
      ) ?? 0;
      stats.lucroTotal += valorVenda - custoVenda;
    }
    if (v.status === "concluida")  stats.vendasConcluidas++;
    if (v.status === "pendente")   stats.vendasPendentes++;
    if (v.status === "atrasado")   stats.pagamentosAtrasados++;
  });

  return stats;
}

/**
 * Monta o mapa de dados para o gráfico (30 dias atrás até 15 dias no futuro).
 * @param {Venda[]} vendasRecentes
 * @param {Nota[]} notasRecentes
 * @returns {object[]}
 */
function montarChartData(vendasRecentes, notasRecentes) {
  const chartDataMap = {};

  for (let i = 30; i >= -15; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = toISODate(d);
    chartDataMap[dateStr] = { name: dateStr, vendas: 0, receita: 0, lucro: 0, debitos: 0, debitosPrevistos: 0, isFuture: i < 0 };
  }

  vendasRecentes.forEach((v) => {
    const dateStr = toISODate(v.data_venda);
    if (!chartDataMap[dateStr]) return;
    chartDataMap[dateStr].vendas += 1;
    if (["concluida", "pendente"].includes(v.status)) {
      const valorVenda = Number(v.valor_total) || 0;
      chartDataMap[dateStr].receita += valorVenda;
      const custo = v.itensVendidos?.reduce((acc, item) => acc + (Number(item.itemEstoque?.valor_compra) || 0), 0) ?? 0;
      chartDataMap[dateStr].lucro += valorVenda - custo;
    }
  });

  notasRecentes.forEach((n) => {
    const valorNota = Number(n.valor_total) || 0;
    if (n.status === "pago") {
      const dateStr = toISODate(n.data);
      if (chartDataMap[dateStr]) chartDataMap[dateStr].debitos += valorNota;
    } else if (["pendente", "vencido"].includes(n.status)) {
      const dateStr = toISODate(n.data_vencimento);
      if (chartDataMap[dateStr]) chartDataMap[dateStr].debitosPrevistos += valorNota;
    }
  });

  return Object.values(chartDataMap);
}

/**
 * Monta os alertas de estoque baixo.
 * @param {ItemEstoque[]} itensEstoque
 * @returns {object[]}
 */
function alertasEstoqueBaixo(itensEstoque) {
  const por_produto = {};
  itensEstoque.forEach((item) => {
    const pId = item.produto_id;
    if (!por_produto[pId]) {
      por_produto[pId] = { id: pId, nome: item.produto?.nome, quantidade: 0, img: item.produto?.img };
    }
    por_produto[pId].quantidade++;
  });

  return Object.values(por_produto)
    .filter((p) => p.quantidade < LIMITE_ESTOQUE_BAIXO)
    .sort((a, b) => a.quantidade - b.quantidade);
}

/**
 * Monta os alertas de notas a vencer nos próximos 7 dias.
 * @param {Nota[]} todasNotas
 * @returns {object[]}
 */
function alertasNotasVencendo(todasNotas) {
  return todasNotas
    .map((nota) => ({
      id:             nota.id,
      codigo:         nota.codigo,
      fornecedor:     nota.fornecedor,
      valor:          nota.valor_total,
      data_vencimento: nota.data_vencimento,
      diasParaVencer: diasAte(nota.data_vencimento),
    }))
    .filter((n) => n.diasParaVencer <= DIAS_ALERTA_VENCIMENTO)
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);
}

/**
 * Busca e consolida todos os dados do dashboard.
 * @returns {Promise<object>}
 */
export async function gerarDashboard() {
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

  const includeItensVendidos = {
    model: ItemVendido,
    as: "itensVendidos",
    include: [{ model: ItemEstoque, as: "itemEstoque" }],
  };

  const [vendasRecentes, todasVendas, notasRecentes, todasNotas, todosItensEstoque] =
    await Promise.all([
      Venda.findAll({
        where: { data_venda: { [Op.gte]: trintaDiasAtras } },
        include: [includeItensVendidos],
      }),
      Venda.findAll({ include: [includeItensVendidos] }),
      Nota.findAll({
        where: {
          [Op.or]: [
            { data: { [Op.gte]: trintaDiasAtras } },
            { data_vencimento: { [Op.gte]: trintaDiasAtras } },
          ],
        },
      }),
      Nota.findAll({
        where: { status: "pendente" },
        include: [{ model: ItemEstoque, as: "itensNota" }],
      }),
      ItemEstoque.findAll({
        where: { status: "Disponivel" },
        include: [{ model: Produto, as: "produto" }],
      }),
    ]);

  return {
    stats:          calcularStats(todasVendas),
    chartData:      montarChartData(vendasRecentes, notasRecentes),
    estoqueBaixo:   alertasEstoqueBaixo(todosItensEstoque),
    notasVencendo:  alertasNotasVencendo(todasNotas),
  };
}
