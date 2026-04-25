import { Cliente, Venda, ItemVendido, NotaVenda } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function clienteRoutes(fastify) {

  fastify.get("/clientes", { preHandler: authMiddleware }, async (request, reply) => {
    const clientes = await Cliente.findAll({
      include: [{
        model: Venda,
        as: "vendas",
        include: [
          { model: ItemVendido, as: "itensVendidos" },
          { model: NotaVenda, as: "notaVenda" },
        ],
      }],
      order: [["nome", "ASC"]],
    });
    return reply.code(200).send(clientes);
  });

  fastify.post("/cliente", { preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;
    if (!data.nome || !data.telefone) return reply.err("Nome e telefone são obrigatórios.");

    const existente = await Cliente.findOne({
      where: { email: data.email || null, nome: data.nome, telefone: data.telefone },
    });
    if (existente) return reply.ok({ clienteExistente: existente }, "Cliente já cadastrado!");

    const novoCliente = await Cliente.create(data);
    return reply.code(201).ok({ novoCliente }, "Cliente cadastrado com sucesso!");
  });

  fastify.put("/cliente/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await Cliente.update(request.body, { where: { id } });
    const clienteAtualizado = await Cliente.findByPk(id);
    return reply.ok({ cliente: clienteAtualizado }, "Cliente atualizado com sucesso!");
  });

  fastify.delete("/cliente/:id", { preHandler: authMiddleware }, async (request, reply) => {
    const cliente = await Cliente.findByPk(request.params.id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);
    await cliente.destroy();
    return reply.code(204).send();
  });
}
