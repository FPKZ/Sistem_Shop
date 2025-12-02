import { Venda, Cliente, ItemVendido, NotaVenda, ItemEstoque } from "../database/models/index.js";

export default async function vendaRoutes(fastify) {
    fastify.get("/vendas", async (request, reply) => {
        try{
            const vendas = await Venda.findAll({
            include: [
                { model: Cliente, as: "cliente" },
                { model: ItemVendido, as: "itensVendidos",
                    include: [
                        {model: ItemEstoque, as: "itemEstoque"}
                    ]
                 },
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

    fastify.put("/venda/:id", async (request, reply) => {
        try{
            const venda_Id = request.params.id
            const data = request.body

            const venda = await Venda.findByPk(venda_Id)
            if (!venda) {
                return reply.code(404).send({ error: "Venda não encontrada" })
            }

            await venda.update(data)
            reply.send({ message: "Venda atualizada com sucesso", venda })
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: "Erro ao atualizar venda", err })
        }
    })
    fastify.delete("/venda/:id", async (request, reply) => {
        try{
            const { id } = request.params
            const venda = await Venda.findByPk(id)
            if (!venda) {
                return reply.code(404).send({ error: "Venda não encontrada" })
            }

            await venda.destroy()
            reply.code(204).send()
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: "Erro ao deletar venda", err })
        }
    })
}