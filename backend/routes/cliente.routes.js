import { Cliente, Venda, ItemVendido, NotaVenda } from "../database/models/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function clienteRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getClientesSchema = {
    description: "Lista todos os clientes com seus históricos de compras e vendas associadas",
    tags: ["Clientes"],
    security: [{ BearerAuth: [] }]
  };

  const postClienteSchema = {
    description: "Cadastra um novo cliente no sistema",
    tags: ["Clientes"],
    security: [{ BearerAuth: [] }],
    body: {
      type: "object",
      required: ["nome", "telefone"],
      properties: {
        nome: { type: "string", examples: ["José da Silva"] },
        telefone: { type: "string", examples: ["13998765432"] },
        email: { type: "string", format: "email", examples: ["jose@email.com"] },
        cpf: { type: "string", examples: ["12345678900"] },
        endereco: { type: "string", examples: ["Rua das Flores, 123, Centro"] }
      }
    }
  };

  const putClienteSchema = {
    description: "Atualiza os dados de um cliente existente por ID",
    tags: ["Clientes"],
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
        nome: { type: "string", examples: ["José da Silva Filho"] },
        telefone: { type: "string", examples: ["13998765433"] },
        email: { type: "string", format: "email", examples: ["jose.filho@email.com"] },
        cpf: { type: "string", examples: ["12345678900"] },
        endereco: { type: "string", examples: ["Avenida Central, 456"] }
      }
    }
  };

  const deleteClienteSchema = {
    description: "Exclui um cliente cadastrado no sistema por ID",
    tags: ["Clientes"],
    security: [{ BearerAuth: [] }],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

  fastify.get("/clientes", { schema: getClientesSchema, preHandler: authMiddleware }, async (request, reply) => {
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

  fastify.post("/cliente", { schema: postClienteSchema, preHandler: authMiddleware }, async (request, reply) => {
    const data = request.body;
    if (!data.nome || !data.telefone) return reply.err("Nome e telefone são obrigatórios.");

    const existente = await Cliente.findOne({
      where: { email: data.email || null, nome: data.nome, telefone: data.telefone },
    });
    if (existente) return reply.ok({ clienteExistente: existente }, "Cliente já cadastrado!");

    const novoCliente = await Cliente.create(data);
    return reply.code(201).ok({ novoCliente }, "Cliente cadastrado com sucesso!");
  });

  fastify.put("/cliente/:id", { schema: putClienteSchema, preHandler: authMiddleware }, async (request, reply) => {
    const { id } = request.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await Cliente.update(request.body, { where: { id } });
    const clienteAtualizado = await Cliente.findByPk(id);
    return reply.ok({ cliente: clienteAtualizado }, "Cliente atualizado com sucesso!");
  });

  fastify.delete("/cliente/:id", { schema: deleteClienteSchema, preHandler: authMiddleware }, async (request, reply) => {
    const cliente = await Cliente.findByPk(request.params.id);
    if (!cliente) return reply.err("Cliente não encontrado", 404);
    await cliente.destroy();
    return reply.code(204).send();
  });
}
