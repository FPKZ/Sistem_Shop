import { Produto, Categoria, ItemEstoque } from "../database/models/index.js";
import { Op } from "sequelize";


function IsNullOrUndefined(value){
    return value === null || value === undefined || value === ""
}

export default async function catalogoRoutes(fastify){
    fastify.get("/catalogo", async (request, reply) => {
        try{
            const query = request.query

            const where = {}

            if (!IsNullOrUndefined(query.categoria)) {
                where.categoria_id = query.categoria
            }

            if (!IsNullOrUndefined(query.nome)) {
                where.nome = { [Op.like]: "%" + query.nome + "%" }
            }

            const produtos = await Produto.findAll({
                where,
                include: [
                    { model: Categoria, as: "categoria"},
                    { model: ItemEstoque, as: "itemEstoque"}
                ]
            })

            const catalogo = produtos.map((produto) => {
                return {
                    id: produto.id,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    categoria: produto.categoria.nome,
                    img: produto.img,
                    // itens: produto.itemEstoque,
                    preco: produto.itemEstoque.some(item => item.status === "Disponivel")
                        ? Math.max(...produto.itemEstoque.filter(item => item.status === "Disponivel").map(item => Number(item.valor_venda)))
                        : 0,
                    quantidade: produto.itemEstoque.length,
                }
            })

            reply.send(catalogo)
        } catch(err){
            console.log(err)
            reply.err("Erro ao buscar produtos", 500)
        }
    })
    fastify.post("/pedido", async (request, reply) => {
        try{
            let pedido = request.body.pedido
            console.log(pedido)
            // pedido = [
            //     {id: 1, quantidade: 2},
            //     {id: 2, quantidade: 1},
            //     {id: 6, quantidade: 1}
            // ]
            
            const produtos = await Produto.findAll({
                where: { id: { [Op.in]: pedido.map(item => item.id) } },
                // include: [
                //     { model: Categoria, as: "categoria"},
                //     { model: ItemEstoque, as: "itemEstoque"}
                // ]
            })

            const mssg = `Olá, gostaria de fazer um pedido:\n\n${pedido.map((item) => {
                const produto = produtos.find((produto) => produto.id === item.id)
                return `*${produto.nome}* - ${item.quantidade}`
            }).join("\n")}`
            console.log(mssg)
            const number = "5513997062443"
            
            reply.send({ url: `https://wa.me/${number}?text=${encodeURIComponent(mssg)}` })
        }catch(err){
            console.log(err)
            reply.err("Erro ao buscar produtos", 500)
        }
    })
}