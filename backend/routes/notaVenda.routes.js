import { Venda, Cliente, ItemVendido, NotaVenda } from "../database/models/index.js";

export default async function notaVendaRoutes(fastify) {
    fastify.get("/notasVendas", async (request, reply) => {
        try{
            const notasVenda = await NotaVenda.findAll({
            include: [
                { model: Venda, as: "venda",
                include: [
                    { model: Cliente, as: "cliente" },
                    { model: ItemVendido, as: "itensVendidos" }
                ]
                }
            ]
            })

            reply.code(200).send(notasVenda)
        }catch(err){
            console.log(err)
            reply.code(500).send({message: "Erro ao buscar Notas de Venda"})
        }
    })
    fastify.post("/notaVenda", async (request, reply) => {
        try{
            const data = request.body

            const venda_id = data.venda_id
            if(!venda_id){
            return reply.code(400).send({message: "O ID da venda é obrigatório para cadastrar uma nota de venda"})
            }
            if(!data.codigo || data.codigo.trim() === ""){
            return reply.code(400).send({message: "O código da nota de venda é obrigatório"})
            }
            if(!data.valor_nota || isNaN(data.valor_nota) || Number(data.valor_nota) <= 0){
            return reply.code(400).send({message: "O valor da nota de venda deve ser um número positivo"})
            }
            if(!data.forma_pagamento || data.forma_pagamento.trim() === ""){
            return reply.code(400).send({message: "A forma de pagamento é obrigatória"})
            }

            const novaNotaVenda = await NotaVenda.create(data)

            reply.code(201).send(novaNotaVenda)
        }catch(err){
            console.log(err)
            reply.code(500).send({message: "Erro ao cadastrar nota de venda", err})
        }
    })
}