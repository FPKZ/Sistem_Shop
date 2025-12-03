import { Venda, Cliente, ItemVendido, NotaVenda, ItemEstoque, ItemReservado } from "../database/models/index.js";
import { Op } from "sequelize";

export default async function vendaRoutes(fastify) {
  fastify.get("/vendas", async (request, reply) => {
    try{
      const vendas = await Venda.findAll({
        include: [
          { model: Cliente, as: "cliente" },
          {
            model: ItemVendido,
            as: "itensVendidos",
            include: [{ model: ItemEstoque, as: "itemEstoque" }],
          },
          { model: NotaVenda, as: "notaVenda" },
        ],
      });

        if(!vendas){
            return reply.code(404).send({message: "Nenhuma venda encontrada", ok: false})
      }

      reply.code(200).send(vendas);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao buscar Vendas", ok: false });
    }
  });

  fastify.post("/venda", async (request, reply) => {
    try {
      console.log(request.body);
      const data = request.body;
      const itensVendidos = data.itensVendidos;

      if (!itensVendidos || itensVendidos.length === 0) {
        return reply.code(400).send({message: "A venda deve conter ao menos um item vendido", ok: false})
      }
      const itensEstoqueIds = itensVendidos.map((item) => item.itemEstoque_id);

      const itensEstoque = await ItemEstoque.findAll({
        where: {
          id: itensEstoqueIds,
        },
      });
      // Verifica se todos os itens existem no estoque
      if (itensEstoque.length !== itensEstoqueIds.length) {
            return reply.code(400).send({ message: "Um ou mais itens do estoque não foram encontrados", ok: false})
      }

      // Verifica se todos os itens estão disponíveis
    //         const itensIndisponiveis = itensEstoque.filter(item => item.status !== "Disponivel")
    //   if (itensIndisponiveis.length > 0) {
    //         return reply.code(400).send({ message: "Um ou mais itens do estoque não estão disponíveis", ok: false })
    //   }

      const clienteId = data.cliente_id;
      const cliente = await Cliente.findByPk(clienteId);
      if (!cliente) {
            return reply.code(404).send({ message: "Cliente não encontrado", ok: false })
      }

      // Verificar se algum item está reservado para OUTRO cliente
      // Buscamos reservas desses itens onde o cliente NÃO é o atual
      const itensReservadosOutroCliente = await ItemReservado.findAll({
        where: {
          itemEstoque_id: itensEstoqueIds,
          cliente_id: { [Op.ne]: clienteId }, // Op.ne = Not Equal (Diferente)
        },
      });

      if (itensReservadosOutroCliente.length > 0) {
        return reply.code(400).send({
          message: "Um ou mais itens estão reservados para outro cliente",
          ok: false,
        });
      }
       const notaVenda = data.notaVenda;
        if (!notaVenda) {
            return reply.code(400).send({message: "A venda deve conter ao menos uma nota", ok: false})
        }

      // Atualiza o status dos itens para "Vendido"
      await Promise.all(
        itensEstoque.map((item) => {
          item.status = "Vendido";
          return item.save();
        })
      );

      // Remove as reservas dos itens vendidos (se existirem)
      await ItemReservado.destroy({
        where: {
          itemEstoque_id: itensEstoqueIds,
        },
      });

      if (!notaVenda) {
        return reply.code(400).send({message: "A venda deve conter ao menos uma nota", ok: false})
        }
        else{
        const novaVenda = await Venda.create(data, {
          include: [
            { model: ItemVendido, as: "itensVendidos" },
            { model: NotaVenda, as: "notaVenda" },
          ],
        });
        return reply.code(201).send({ novaVenda, ok: true });
      }
    } catch (err) {
        console.log(err);
      reply.code(500).send({ message: "Erro ao cadastrar venda", ok: false });
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
}
