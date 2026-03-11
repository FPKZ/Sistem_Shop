import {
  Cliente,
  NotaVenda,
  ItemVendido,
  Venda,
} from "../database/models/index.js";

export default async function clienteRoutes(fastify) {
  fastify.get("/clientes", async (request, reply) => {
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

    return reply.send(clientes);
  });

  fastify.post("/cliente", async (request, reply) => {
    const data = request.body;
    console.log("\n[BACKEND] Tentando cadastrar cliente. Dados recebidos:", data);

    if (!data.nome || !data.telefone) {
      return reply.err("Nome e telefone são obrigatórios.");
    }

    const clienteExistente = await Cliente.findOne({
      where: {
        email: data.email || null,
        nome: data.nome,
        telefone: data.telefone,
      },
    });

    if (clienteExistente) {
      return reply.ok({ clienteExistente }, "Cliente já cadastrado!");
    }

    const novoCliente = await Cliente.create(data);
    return reply.code(201).ok({ novoCliente }, "Cliente cadastrado com sucesso!");
  });

  fastify.put("/cliente/:id", async (request, reply) => {
    const { id } = request.params;
    const data = request.body;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await Cliente.update(data, { where: { id } });
    const clienteAtualizado = await Cliente.findByPk(id);
    return reply.ok({ cliente: clienteAtualizado }, "Cliente atualizado com sucesso!");
  });

  fastify.delete("/cliente/:id", async (request, reply) => {
    const { id } = request.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await cliente.destroy();
    return reply.status(204).ok({}, "Cliente deletado com sucesso");
  });
}
