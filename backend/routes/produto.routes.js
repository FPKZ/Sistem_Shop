import { Produto, Nota, Categoria, ItemEstoque } from "../database/models/index.js";
import { Op } from "sequelize"

export default async function produtoRoutes(fastify) {
  fastify.get("/produtos", async (request, reply) => {
    const query = request.query
    console.log(query)

    if(query.itens === "all"){
  
      const produtos = await ItemEstoque.findAll({
        include: [
          {model: Nota, as: "nota"}
        ]
      })
  
      return reply.code(200).send(produtos)
    }
    else if(query.itens === "vendidos"){
      console.log("vendidos")
      const produtos = await ItemEstoque.findAll({
        where: {status: "Vendido"},
        include: [
          {model: Nota, as: "nota"}
        ]
      })
      console.log(produtos)
      return reply.code(200).send(produtos)
    }
    else if(query.itens === "estoque"){
      console.log("estoque")
      const produtos = await ItemEstoque.findAll({
        where: {status: "Disponivel"},
        include: [
          {model: Nota, as: "nota"}
        ]
      })
      console.log(produtos)
      return reply.code(200).send(produtos)
    }
    else if(query.nome && query.nome !== " "){
      console.log(query.nome)
      const produtos = await Produto.findAll({
        where: { nome: { [Op.like]: "%" + query.nome + "%"} },
        include: [
          { model: Categoria, as: "categoria"},
          { model: ItemEstoque, as: "itemEstoque",
            include: [
              {model: Nota, as: "nota"}
            ]
          }
        ]
      })

      return reply.code(200).send(produtos)
    }
    
    try{
      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, as: 'categoria' },
          { model: ItemEstoque, as: 'itemEstoque',
            include: [
              { model: Nota, as: "nota" }
            ]
           }
        ]
      })
  
      return reply.send(produtos)
    } catch(err){
      console.log(err)
      return reply.code(500).send({ error: 'Erro ao buscar produtos' })
    }

  })

  fastify.post("/produto", async (request, reply) => {
    try{
      const query = request.query.query
      console.log(query)
      
      const { nome, descricao, categoria_id, img, itens } = request.body
  
      let produto = await Produto.findOne({ where: { nome: nome }})
  
      if(!produto){
        produto = await Produto.create({nome, descricao, categoria_id, img})
      }
  
      if(itens && itens.length > 0){
        const NovoItem = await itens.map(item => ({
          nome,
          nota_id: item.nota_id,
          tamanho: item.tamanho,
          cor: item.cor,
          marca: item.marca,
          codigo_barras: item.codigo_barras,
          valor_compra: item.valor_compra,
          valor_venda: item.valor_venda,
          lucro: item.lucro,
          produto_id: produto.id,
          status: "Disponivel"
        }))
        console.log(NovoItem)
        await ItemEstoque.bulkCreate(NovoItem)
      }
  
  
      //const novoProduto = await Produto.create(data)
  
      reply.code(201).send({ message: "Estoque atualizado com sucesso!", produto })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao cadastrar produtos' })
    }
  })

  fastify.put("/produto/:id", async (request, reply) => {
    try{
      const produtoId = request.params.id
      const data = request.body
  
      const produto = await Produto.findByPk(produtoId)
  
      if (!produto) {
        return reply.status(404).send({ error: 'Produto não encontrado' })
      }
  
      await produto.update(data)
  
      reply.send({ message: 'Produto atualizado com sucesso', produto })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao atualizar produto' })
    }
  })

  fastify.delete("/produto/:id", async (request, reply) => {
    try {
      const produtoId = request.params.id
      
      const produto = await Produto.findByPk(produtoId)
  
      if (!produto) {
        return reply.status(404).send({ error: 'Produto não encontrado' })
      }
  
      await produto.destroy()
  
      reply.status(204).send({message: 'Produto deletado com sucesso'})
    } catch (err) {
      console.log(err)
      reply.code(500).send({ error: 'Erro ao deletar produto' })
    }
  })
}