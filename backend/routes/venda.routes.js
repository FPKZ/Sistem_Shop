import { Venda, Cliente, ItemVendido, NotaVenda, ItemEstoque } from "../database/models/index.js";

export default async function vendaRoutes(fastify) {
    fastify.get("/vendas", async (request, reply) => {
        try{
            const vendas = await Venda.findAll({
            include: [
                { model: Cliente, as: "cliente" },
                { model: ItemVendido, as: "itensVendidos" },
                { model: NotaVenda, as: "pagamento" }
            ]
            })

            reply.code(200).send(vendas)
        }catch(err){
            console.log(err)
            reply.code(500).send({message: "Erro ao buscar Vendas"})
        }
    })
    
    fastify.post("/venda", async (request, reply) => {
        try{
            const data = request.body
            const itensVendidos = data.itensVendidos

            if(!itensVendidos || itensVendidos.length === 0) {
            return reply.code(400).send({message: "A venda deve conter ao menos um item vendido"})
            }
            const itensEstoqueIds = itensVendidos.map(item => item.itemEstoque_id)

            const itensEstoque = await ItemEstoque.findAll({
            where: {
                id: itensEstoqueIds
            }
            })
            // Verifica se todos os itens existem no estoque
            if (itensEstoque.length !== itensEstoqueIds.length) {
            return reply.code(400).send({ message: "Um ou mais itens do estoque não foram encontrados" })
            }

            // Verifica se todos os itens estão disponíveis
            const itensIndisponiveis = itensEstoque.filter(item => item.status !== "Disponivel")
            if (itensIndisponiveis.length > 0) {
            return reply.code(400).send({ message: "Um ou mais itens do estoque não estão disponíveis" })
            }
            // Atualiza o status dos itens para "Vendido"
            await Promise.all(itensEstoque.map(item => {
            item.status = "Vendido"
            return item.save()
            }))
            const notaVenda = data.notaVenda
            if(!notaVenda){
            const novaVenda = await Venda.create(data, {
                include: [
                { model: ItemVendido, as: "itensVendidos" },]
            })
            return reply.code(201).send(novaVenda)
            }
            else{
            const novaVenda = await Venda.create(data, {
                include: [
                { model: NotaVenda, as: "notaVenda" },
                { model: ItemVendido, as: "itensVendidos" },
                ]
            })
            return reply.code(201).send(novaVenda)
            }
        }catch(err){
            console.log(err)
            reply.code(500).send({message: "Erro ao cadastrar venda", err})
        }
    })
}