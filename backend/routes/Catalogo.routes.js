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
                    { model: ItemEstoque, as: "itens"}
                ]
            })

            const catalogo = produtos.map((produto) => {
                return {
                    id: produto.id,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    categoria: produto.categoria.nome,
                    imagem: produto.imagem,
                    preco: produto.itens.length > 0 ? Math.max(...produto.itens.map((item) => Number(item.preco))) : 0,
                    quantidade: produto.itens.length,
                }
            })

            reply.send(catalogo)
        } catch(err){
            console.log(err)
            reply.code(500).send({error: "Erro ao buscar produtos"})
        }
    })
}