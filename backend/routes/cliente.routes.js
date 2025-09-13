import { Cliente, NotaVenda, ItemVendido, Venda } from "../database/models/index.js";

export default async function clienteRoutes(fastify) {
    fastify.get("/clientes", async (request, reply) => {
        try{
            const clientes = await Cliente.findAll({
            include: [
            { model: Venda, as: "vendas", 
                include: [
                { model: ItemVendido, as: "itensVendidos"},
                { model: NotaVenda, as: "pagamento"}
                ]
            },
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
        const novoCliente = await Cliente.create(data)
    
        reply.code(201).send(novoCliente)
      } catch(err){
        console.log(err)
        reply.code(500).send({error: "Erro ao cadastrar Cliente", err})
      }
    })
}