import {
  Cliente,
  NotaVenda,
  ItemVendido,
  Venda,
} from "../database/models/index.js";

export default async function clienteRoutes(fastify) {
  fastify.get("/clientes", async (request, reply) => {
    try {
      const clientes = await Cliente.findAll({
        include: [
          {
            model: Venda,
            as: "vendas",
            include: [
              { model: ItemVendido, as: "itensVendidos" },
              { model: NotaVenda, as: "notaVenda" },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });

      reply.code(200).send(clientes);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Erro ao buscar Clientes", ok: false });
    }
  });

  fastify.post("/cliente", async (request, reply) => {
    try {
      const data = request.body;
      console.log(
        "\n[BACKEND] Tentando cadastrar cliente. Dados recebidos:",
        data,
      );

      if (!data.nome || !data.telefone) {
        console.log("[BACKEND] Erro: Nome ou telefone ausentes.");
        return reply
          .code(400)
          .send({ message: "Nome e telefone são obrigatórios.", ok: false });
      }

      const clienteExistente = await Cliente.findOne({
        where: {
          email: data.email || null,
          nome: data.nome,
          telefone: data.telefone,
        },
      });

      if (clienteExistente) {
        console.log("[BACKEND] Cliente já existe.");
        return reply.code(200).send({
          message: "Cliente já cadastrado!",
          clienteExistente,
          ok: false,
        });
      }

      const novoCliente = await Cliente.create(data);
      console.log("[BACKEND] Cliente criado com sucesso:", novoCliente.id);

      reply.code(201).send({
        message: "Cliente cadastrado com sucesso!",
        novoCliente,
        ok: true,
      });
    } catch (err) {
      console.error("\n[BACKEND] ERRO CRÍTICO NO CADASTRO:", err);
      reply
        .code(500)
        .send({
          error: "Erro ao cadastrar Cliente",
          message: err.message,
          ok: false,
        });
    }
  });

  fastify.put("/cliente/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const data = request.body;

      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return reply
          .code(404)
          .send({ error: "Cliente não encontrado", ok: false });
      }

      await Cliente.update(data, { where: { id } });
      const clienteAtualizado = await Cliente.findByPk(id);
      reply.code(200).send({
        message: "Cliente atualizado com sucesso!",
        cliente: clienteAtualizado,
        ok: true,
      });
    } catch (err) {
      console.log(err);
      reply
        .code(500)
        .send({ error: "Erro ao atualizar Cliente", err, ok: false });
    }
  });

  fastify.delete("/cliente/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return reply.code(404).send({ error: "Cliente não encontrado" });
      }

      await cliente.destroy();
      reply.code(204).send();
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao deletar Cliente", err });
    }
  });
}
