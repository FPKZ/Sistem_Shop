import { Produto, Categoria } from "../database/models/index.js";

export default async function categoriaRoutes(fastify) {

    fastify.get("/categorias", async (request, reply) => {
        try{
            const categoria = await Categoria.findAll({
            include: [
                { model: Produto, as: "produtos"}
            ]
            })
            reply.send(categoria)
        } catch(err){
            console.log(err)
            reply.code(500).send({error: "Erro ao buscar Categorias"})
        }
    })

    fastify.post("/categoria", async (request, reply) => {
        try{
            //const query = request.query.query
            
            const data = request.body
            const novacategoria = await Categoria.create(data)

            reply.code(201).send(novacategoria)
        } catch(err){
            console.log(err)
            reply.code(500).send({error: "Erro ao cadastrar categoria"})
        }
    })

    fastify.put("/categoria/:id", async (request, reply) => {
        try{
            const categoria_Id = request.params.id
            const data = request.body

            const categoria = await Categoria.findByPk(categoria_Id)

            if (!categoria) {
            return reply.status(404).send({ error: 'Categoria não encontrado' })
            }

            await categoria.update(data)

            reply.send({ message: 'Categoria atualizado com sucesso', categoria })
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: 'Erro ao atualizar categoria' })
        }
    })
    fastify.delete("/categoria/:id", async (request, reply) => {
        try{
            const categoria_Id = request.params.id

            const categoria =await Categoria.findByPk(categoria_Id)

            if(!categoria){
            return reply.status(404).send({error : "Categoria não encontrada"})
            }
            await categoria.destroy()

            reply.status(204).send({message: "Categoria deletada com sucesso"})
        } catch(err){
            console.log(err)
            reply.code(500).send({error: "Erro ao deletar categoria"})
        }
    })
}