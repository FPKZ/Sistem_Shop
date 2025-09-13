import { Nota, ItemEstoque } from "../database/models/index.js";

export default async function notaRoutes(fastify) {
    fastify.get("/notas", async (request, reply) => {
        try{
            const notas = await Nota.findAll({
            include: [
                { model: ItemEstoque, as: "itensNota"},
            ]
            })

            reply.send(notas)
        } catch(err){
            console.log(err)
            reply.code(500).send({error: "Erro ao buscar Notas"})
        }
    })

    fastify.post("/nota", async (request, reply) => {
        try{
            const data = request.body
            const novanota = await Nota.create(data)

            reply.code(201).send(novanota)
        } catch(err){
            console.log(err)
        reply.code(500).send({error: "Erro ao cadastrar nota"})
        }
    })
    fastify.put("/nota/:id", async (request, reply) => {
        try{
            const nota_id = request.params.id
            const data = request.body

            const nota = await Nota.findByPk(nota_id)

            if (!nota) {
            return reply.status(404).send({ error: 'Nota não encontrado' })
            }

            await nota.update(data)

            reply.send({ message: 'Nota atualizado com sucesso', nota })
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: 'Erro ao atualizar nota' })
        }
    })
    fastify.delete("/nota/:id", async (request, reply) => {
      try{
        const nota_id = request.params.id
    
        const nota = await Nota.findByPk(nota_id)
    
        if(!nota) return reply.status(404).send({error : "Nota não encontrada"})
        
        await nota.destroy()
        
        reply.status(204).send({message: "Nota deletada com sucesso"})
      } catch(err){
        console.log(err)
        reply.code(500).send({error: "Erro ao deletar nota"})
      }
    })
}