import { Cliente, NotaVenda, ItemVendido, Venda } from "../database/models/index.js";

export default async function clienteRoutes(fastify) {
  fastify.get("/clientes", async (request, reply) => {
      try{
          const clientes = await Cliente.findAll({
          include: [
          { model: Venda, as: "vendas", 
              include: [
              { model: ItemVendido, as: "itensVendidos"},
              { model: NotaVenda, as: "notaVenda"}
              ]
          },
          ],
          order: [
            ["id", "ASC"]
          ]
          })

          reply.code(200).send(clientes)
      }catch(err){
          console.log(err)
          reply.code(500).send({message: "Erro ao buscar Clientes"})
      }
  })

  fastify.post("/cliente", async (request, reply) => {
    try{
      const data = request.body

      const clienteExistente = await Cliente.findOne({ where: { email: data.email, nome: data.nome, telefone: data.telefone }})

      if(clienteExistente) return reply.code(200).send({message: "Cliente já cadastrado!", clienteExistente, ok: false})

      const novoCliente = await Cliente.create(data)
  
      reply.code(201).send({ message: "Cliente cadastrado com sucesso!", novoCliente, ok: true})
    } catch(err){
      console.log(err)
      reply.code(500).send({error: "Erro ao cadastrar Cliente", err, ok: false})
    }
  })

  fastify.put("/cliente/:id", async (request, reply) => {
    try{
      const { id } = request.params
      const data = request.body

      const cliente = await Cliente.findByPk(id)
      if (!cliente) {
        return reply.code(404).send({ error: "Cliente não encontrado" })
      }

      await Cliente.update(data, { where: { id } })
      reply.code(204).send()
    } catch(err){
      console.log(err)
      reply.code(500).send({error: "Erro ao atualizar Cliente", err})
    }
  })

  fastify.delete("/cliente/:id", async (request, reply) => {
    try{
      const { id } = request.params
      const cliente = await Cliente.findByPk(id)
      if (!cliente) {
        return reply.code(404).send({ error: "Cliente não encontrado" })
      }

      await cliente.destroy()
      reply.code(204).send()
    } catch(err){
      console.log(err)
      reply.code(500).send({error: "Erro ao deletar Cliente", err})
    }
  })
}