import {
  Venda,
  Cliente,
  ItemVendido,
  NotaVenda,
  ItemEstoque,
  ItemReservado,
  Produto,
} from "../database/models/index.js";
import { Op } from "sequelize";

export default async function vendaRoutes(fastify) {
  fastify.get("/vendas/dashboard", async (request, reply) => {
    try {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

      const vendas = await Venda.findAll({
        where: {
          data_venda: { [Op.gte]: seteDiasAtras },
        },
      });

      const todasVendas = await Venda.findAll();

      // Estatísticas gerais
      const stats = {
        totalVendas: todasVendas.filter((v) => v.status !== "cancelada").length,
        totalReceita: todasVendas.reduce((acc, v) => {
          // Apenas somar se for concluída ou pendente (não reserva expirada/cancelada/estornada)
          if (["concluida", "pendente"].includes(v.status)) {
            return acc + (Number(v.valor_total) || 0);
          }
          return acc;
        }, 0),
        vendasConcluidas: todasVendas.filter((v) => v.status === "concluida")
          .length,
        vendasPendentes: todasVendas.filter((v) => v.status === "pendente")
          .length,
        devolucoes: todasVendas.filter(
          (v) => v.status === "devolvida" || v.status === "estorno",
        ).length,
        pagamentosAtrasados: todasVendas.filter((v) => v.status === "atrasado")
          .length,
      };

      // Dados do gráfico (últimos 7 dias)
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

      reply.code(200).send({
        stats,
        chartData: Object.values(chartDataMap),
      });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao gerar dashboard", ok: false });
    }
  });

  fastify.get("/vendas", async (request, reply) => {
    try {
      // Verificar expiração de reservas antes de retornar
      const agora = new Date();
      const reservasExpiradas = await Venda.findAll({
        where: {
          status: "pendente",
          prazo_reserva: { [Op.lt]: agora },
        },
        include: [{ model: ItemVendido, as: "itensVendidos" }],
      });

      if (reservasExpiradas.length > 0) {
        for (const reserva of reservasExpiradas) {
          const itensEstoqueIds = reserva.itensVendidos.map(
            (item) => item.itemEstoque_id,
          );

          // Voltar itens para Disponível
          await ItemEstoque.update(
            { status: "Disponivel" },
            { where: { id: itensEstoqueIds } },
          );

          // Remover ItemReservado
          await ItemReservado.destroy({
            where: { itemEstoque_id: itensEstoqueIds },
          });

          // Marcar venda como cancelada ou expirada
          await reserva.update({ status: "cancelada" });
        }
      }

      const vendas = await Venda.findAll({
        include: [
          { model: Cliente, as: "cliente" },
          {
            model: ItemVendido,
            as: "itensVendidos",
            include: [
              {
                model: ItemEstoque,
                as: "itemEstoque",
                include: [{ model: Produto, as: "produto" }],
              },
            ],
          },
          { model: NotaVenda, as: "notaVenda" },
        ],
        order: [["data_venda", "DESC"]],
      });

      if (!vendas) {
        return reply
          .code(404)
          .send({ message: "Nenhuma venda encontrada", ok: false });
      }

      reply.code(200).send(vendas);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao buscar Vendas", ok: false });
    }
  });

  fastify.get("/venda/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const venda = await Venda.findByPk(id, {
        include: [
          { model: Cliente, as: "cliente" },
          {
            model: ItemVendido,
            as: "itensVendidos",
            include: [
              {
                model: ItemEstoque,
                as: "itemEstoque",
                include: [{ model: Produto, as: "produto" }],
              },
            ],
          },
          { model: NotaVenda, as: "notaVenda" },
        ],
      });

      if (!venda) {
        return reply
          .code(404)
          .send({ message: "Venda não encontrada", ok: false });
      }

      reply.code(200).send(venda);
    } catch (err) {
      console.log(err);
      reply
        .code(500)
        .send({ message: "Erro ao buscar detalhes da venda", ok: false });
    }
  });

  fastify.post("/venda", async (request, reply) => {
    try {
      console.log(request.body);
      const data = request.body;
      const itensVendidos = data.itensVendidos;
      const reservar = data.reservar; // Novo campo vindo do frontend

      if (!itensVendidos || itensVendidos.length === 0) {
        return reply.code(400).send({
          message: "A venda deve conter ao menos um item vendido",
          ok: false,
        });
      }
      const itensEstoqueIds = itensVendidos.map((item) => item.itemEstoque_id);

      const itensEstoque = await ItemEstoque.findAll({
        where: {
          id: itensEstoqueIds,
        },
      });

      if (itensEstoque.length !== itensEstoqueIds.length) {
        return reply.code(400).send({
          message: "Um ou mais itens do estoque não foram encontrados",
          ok: false,
        });
      }

      const clienteId = data.cliente_id;
      const cliente = await Cliente.findByPk(clienteId);
      if (!cliente) {
        return reply
          .code(404)
          .send({ message: "Cliente não encontrado", ok: false });
      }

      // Verificar reservas de outros clientes
      const itensReservadosOutroCliente = await ItemReservado.findAll({
        where: {
          itemEstoque_id: itensEstoqueIds,
          cliente_id: { [Op.ne]: clienteId },
        },
      });

      if (itensReservadosOutroCliente.length > 0) {
        return reply.code(400).send({
          message: "Um ou mais itens estão reservados para outro cliente",
          ok: false,
        });
      }

      const notaVenda = data.notaVenda;
      if (!reservar && (!notaVenda || notaVenda.length === 0)) {
        return reply.code(400).send({
          message: "A venda deve conter ao menos uma nota de pagamento",
          ok: false,
        });
      }

      // Atualiza o status dos itens
      const novoStatusItem = reservar ? "Reservado" : "Vendido";
      await Promise.all(
        itensEstoque.map((item) => {
          item.status = novoStatusItem;
          return item.save();
        }),
      );

      // Se for reserva, criar entradas na tabela ItemReservado
      if (reservar) {
        await Promise.all(
          itensEstoqueIds.map((itemId) =>
            ItemReservado.create({
              cliente_id: clienteId,
              itemEstoque_id: itemId,
              data: new Date(),
            }),
          ),
        );
      } else {
        // Se for venda concluída, remove as reservas existentes (se houver)
        await ItemReservado.destroy({
          where: {
            itemEstoque_id: itensEstoqueIds,
          },
        });
      }

      // Definir status da venda
      if (reservar) {
        data.status = "pendente";
      } else {
        data.status = notaVenda.every(
          (item) => item.forma_pagamento === "Promissória",
        )
          ? "pendente"
          : "concluida";
      }

      const novaVenda = await Venda.create(data, {
        include: [
          { model: ItemVendido, as: "itensVendidos" },
          { model: NotaVenda, as: "notaVenda" },
        ],
      });

      return reply.code(201).send({ novaVenda, ok: true });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao cadastrar venda", ok: false });
    }
  });

  fastify.put("/venda/:id/finalizar", async (request, reply) => {
    try {
      const { id } = request.params;
      const data = request.body; // Deve conter notaVenda, desconto, valor_total
      const notaVenda = data.notaVenda;

      const venda = await Venda.findByPk(id, {
        include: [{ model: ItemVendido, as: "itensVendidos" }],
      });

      if (!venda) {
        return reply
          .code(404)
          .send({ message: "Venda não encontrada", ok: false });
      }

      const itensEstoqueIds = venda.itensVendidos.map(
        (item) => item.itemEstoque_id,
      );

      // Atualizar status dos itens para Vendido
      await ItemEstoque.update(
        { status: "Vendido" },
        { where: { id: itensEstoqueIds } },
      );

      // Remover Reservas
      await ItemReservado.destroy({
        where: { itemEstoque_id: itensEstoqueIds },
      });

      // Calcular status final
      const statusFinal = notaVenda.every(
        (item) => item.forma_pagamento === "Promissória",
      )
        ? "pendente"
        : "concluida";

      // Atualizar a Venda
      await venda.update({
        status: statusFinal,
        desconto: data.desconto,
        valor_total: data.valor_total,
        prazo_reserva: null, // Limpa o prazo
      });

      // Criar as Notas de Venda (Pagamentos)
      if (notaVenda && notaVenda.length > 0) {
        await Promise.all(
          notaVenda.map((n) =>
            NotaVenda.create({
              ...n,
              venda_id: id,
            }),
          ),
        );
      }

      reply
        .code(200)
        .send({ message: "Venda finalizada com sucesso", ok: true });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao finalizar venda", ok: false });
    }
  });

  fastify.put("/venda/:id", async (request, reply) => {
    try {
      const venda_Id = request.params.id;
      const data = request.body;

      const venda = await Venda.findByPk(venda_Id);
      if (!venda) {
        return reply
          .code(404)
          .send({ error: "Venda não encontrada", ok: false });
      }

      await venda.update(data);
      reply.send({ message: "Venda atualizada com sucesso", venda, ok: true });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao atualizar venda", ok: false });
    }
  });
  fastify.delete("/venda/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const venda = await Venda.findByPk(id);
      if (!venda) {
        return reply
          .code(404)
          .send({ error: "Venda não encontrada", ok: false });
      }

      await venda.destroy();
      reply.code(204).send({ ok: true });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao deletar venda", ok: false });
    }
  });
  fastify.put("/venda/:id/estorno", async (request, reply) => {
    try {
      const { id } = request.params;
      const venda = await Venda.findByPk(id, {
        include: [{ model: ItemVendido, as: "itensVendidos" }],
      });

      if (!venda) {
        return reply
          .code(404)
          .send({ error: "Venda não encontrada", ok: false });
      }

      if (venda.status === "estorno") {
        return reply
          .code(400)
          .send({ error: "Venda já está estornada", ok: false });
      }

      const itensEstoqueIds = venda.itensVendidos.map(
        (item) => item.itemEstoque_id,
      );

      // Atualiza os itens devolvendo ao estoque
      await ItemEstoque.update(
        { status: "Disponivel" },
        { where: { id: itensEstoqueIds } },
      );

      // Marca a Venda como estornada
      await venda.update({ status: "estorno" });

      reply
        .code(200)
        .send({ message: "Estorno realizado com sucesso", ok: true });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao estornar venda", ok: false });
    }
  });

  fastify.put("/venda/:id/devolucao", async (request, reply) => {
    try {
      const { id } = request.params;
      const { itensDevolverIds, valorDevolvido } = request.body; // ids do ItemEstoque a devolver

      const venda = await Venda.findByPk(id);

      if (!venda) {
        return reply
          .code(404)
          .send({ error: "Venda não encontrada", ok: false });
      }

      if (!itensDevolverIds || itensDevolverIds.length === 0) {
        return reply.code(400).send({
          error: "É necessário informar os itens para devolução",
          ok: false,
        });
      }

      // Torna novamente Disponível os Itens no Estoque
      await ItemEstoque.update(
        { status: "Disponivel" },
        { where: { id: itensDevolverIds } },
      );

      // Remove os Itens Vendidos do histórico dessa venda
      await ItemVendido.destroy({
        where: {
          venda_id: id,
          itemEstoque_id: itensDevolverIds,
        },
      });

      // Abate o valor
      const novoTotal = Number(venda.valor_total) - Number(valorDevolvido);

      await venda.update({ valor_total: novoTotal });

      reply.code(200).send({
        message: "Devolução parcial realizada com sucesso!",
        novaVenda: venda,
        ok: true,
      });
    } catch (err) {
      console.log(err);
      reply
        .code(500)
        .send({ error: "Erro ao devolver itens da venda", ok: false });
    }
  });
}
