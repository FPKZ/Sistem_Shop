import { salvarImagems, listarImgs, deletarImagem, limparImagensOrfas } from "../services/img.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { env } from "../config/env.js";

export default async function ImagensRoute(fastify) {

    fastify.get("/imagens", { preHandler: authMiddleware }, async ( request, reply ) => {
        try{
            const list = await listarImgs()
            reply.ok({data: list})
        } catch (err){
            reply.err(err)
        }
    })

    fastify.post("/imagens/salvar", { preHandler: authMiddleware }, async ( request, reply) => {
        try{
            const tipospermitidos = ["image/png", "image/jpeg"]
    
            let imgList = []
    
            if(!request.isMultipart()) return reply.err("Envie uma ou mais imgens")
            
            const parts = request.parts()
    
            for await (const part of parts){
                if(part.type === "file"){
                    if(!tipospermitidos.includes(part.mimetype)) return reply.err(`Erro ao salvar o arquivo ${part.filename}, Arquivo não suportado`)
                    
                    const buffer = await part.toBuffer()
    
                    if(part.file.truncated){
                        return reply.err(`O arquivo ${part.filename} ultrapassa o tamanho permitido pelo sistema. o limite maximo é 10mb`)
                    }
    
    
                    imgList.push({
                        filename: part.filename,
                        buffer: buffer,
                    })
                }
            }

            const urls = await salvarImagems(imgList)
    
            return reply.ok({ message: `${imgList.length} Imagens salvas com sucesso!!!`, data: urls})
        } catch (err) {
            reply.err(err)
        }
    })

    fastify.delete("/imagen/deletar", { preHandler: authMiddleware }, async ( request, reply ) => {
        try{
            const { url } = request.body
            console.log(`URL: ${url}`)
            const blob = await deletarImagem(url)
            console.log(`Blob: ${blob}`)
            reply.ok({ data: blob })
        } catch (err){
        }
    })

    fastify.post("/imagens/limpar-orfas", async ( request, reply ) => {
        try{
            const { secret } = request.query
            
            if(secret !== env.CRON_SECRET) {
                return reply.code(401).send({ ok: false, error: "Chave de segurança inválida" })
            }

            // Executa em background para não dar timeout no chamador
            limparImagensOrfas().catch(err => console.error("[CRON] Erro:", err.message))
            
            reply.ok({ message: "Processo de limpeza iniciado com sucesso" })
        } catch (err){
            reply.err(err)
        }
    })
}