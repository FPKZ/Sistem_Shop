import { Nota, ItemEstoque } from "../database/models/index.js";
import { CadastroProduto, toBuffer } from "./produto.routes.js";

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
            const parts = await request.parts()
            const body = {}
            const imgFiles = {}
            console.log(parts)
            for await (const part of parts){
                if(part.type === "file"){
                    const buffer = await toBuffer(part.file)
                    imgFiles[part.fieldname] = { buffer: buffer, filename: part.filename }
                    console.log("a")
                } else {
                    console.log("b")
                    body[part.fieldname] = part.value
                }
            }

            const { codigo, valor_total, data, fornecedor, quantidade } = body

            console.log(body)
            const novaNota = await Nota.create({
                codigo,
                valor_total,
                data,
                fornecedor,
                quantidade
            })
            
            if(!body.itens && body.itens.length === 0) return reply.code(201).send({ message: "Nota cadastrada com sucesso!", novaNota, ok: true})

            const produtoParaCadastrar = JSON.parse(body.itens)
            const resultadosCadastro = []

            for(const produtoData of produtoParaCadastrar){
                if(produtoData.itens && produtoData.itens.length > 0){
                    produtoData.itens[0].nota_id = novaNota.id
                }

                const imgKey = `imagem_${produtoData.frontId}`
                const imgFile = imgFiles[imgKey]
                
                const result = await CadastroProduto(produtoData,imgFile)
                resultadosCadastro.push(result)

            }

            reply.code(201).send({ message: "Nota e produtos cadatrados com sucesso!", nota: novaNota, produtos: resultadosCadastro, ok: true})
        } catch(err){
            console.log(err)
        reply.code(500).send({error: "Erro ao cadastrar nota", ok: false})
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