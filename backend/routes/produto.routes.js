import { Produto, Nota, Categoria, ItemEstoque, Cliente, ItemVendido, ItemReservado} from "../database/models/index.js";
import { Op } from "sequelize"
import { put } from "@vercel/blob"
import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import "dotenv/config"
//const pump = util.promisify(pipeline)

export default async function produtoRoutes(fastify) {
  fastify.get("/produtos", async (request, reply) => {
    const query = request.query
    //console.log(query)

    if(query.itens === "all"){
      console.log("all")
      const produtos = await ItemEstoque.findAll({
        include: [
          {model: Nota, as: "nota"},
          {model: Produto, as: "produto",
            include: [
              {model: Categoria, as: "categoria"}
            ]
          }
        ]
      })
  
      return reply.code(200).send(produtos)
    }
    else if(query.itens === "vendidos"){
      console.log("vendidos")
      const produtos = await ItemEstoque.findAll({
        where: {status: "Vendido"},
        include: [
          {model: Nota, as: "nota"},
          {model: Produto, as: "produto",
            include: [
              {model: Categoria, as: "categoria"}
            ]
          }
        ]
      })
      // console.log(produtos)
      return reply.code(200).send(produtos)
    }
    else if(query.itens === "estoque"){
      console.log("estoque")
      // const produtos = await ItemEstoque.findAll({
      //   where: {status: "Disponivel"},
      //   include: [
      //     {model: Nota, as: "nota"},
      //     {model: Produto, as: "produto",
      //       include: [
      //         {model: Categoria, as: "categoria"}
      //       ]
      //     }
      //   ]
      // })
      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, as: "categoria" },
          { model: ItemEstoque, as: "itemEstoque",
            where: {status: "Disponivel"},
            include: [
              {model: Nota, as: "nota"}
            ]
          }
        ]
      })
      // console.log(produtos)
      return reply.code(200).send(produtos)
    }
    else if(query.itens === "reservado"){
      console.log("reservado")
      const produtos = await ItemEstoque.findAll({
        where: {status: "Reservado"},
        include: [
          {model: Nota, as: "nota"},
          {model: Produto, as: "produto",
            include: [
              {model: Categoria, as: "categoria"}
            ]
          }
        ]
      })
      // console.log(produtos)
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
      console.log("produtos")
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

      const data = await request.parts()
      const body = {}
      let imgFile = null
      
      for await (const part of data){
        if(part.type === "file") {
          const buffer = await toBuffer(part.file)
          imgFile = { buffer: buffer, filename: part.filename }
          console.log(`Arquivo processado: ${part.filename}`)
        } else {
          body[part.fieldname] = part.value
        }
      }

      body.itens = JSON.parse(body.itens)

      const result = await CadastroProduto(body, imgFile)
  
      //const novoProduto = await Produto.create(data)
  
      reply.code(201).send({ message: "Estoque atualizado com sucesso!", ...result, ok: true })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao cadastrar produtos', ok: false })
    }
  })

  fastify.put("/produto/reservar/:id", async (request, reply) => {
    try{
      const produtoId = request.params.id
      const clienteId = request.query.cliente_id
      const cliente = await Cliente.findByPk(clienteId)
      const produto = await ItemEstoque.findByPk(produtoId)

      if (!produto) {
        return reply.status(404).send({ error: 'Produto não encontrado', ok: false })
      }

      if (!cliente) {
        return reply.status(404).send({ error: 'Cliente não encontrado', ok: false })
      }

      await ItemReservado.create({
        cliente_id: clienteId,
        itemEstoque_id: produtoId,
        data: new Date()
      })

      await produto.update({status: "Reservado"})

      reply.send({ message: 'Produto reservado com sucesso', produto, ok: true })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao reservar produto', ok: false })
    }
  })

  fastify.put("/produto/remover/:id", async (request, reply) => {
    try{
      const itemId = request.params.id
      const data = request.body

      const item = await ItemEstoque.findByPk(itemId)
      const itemReservado = await ItemReservado.findOne({where: {itemEstoque_id: itemId}})

      if (!item) {
        return reply.status(404).send({ error: 'Item não encontrado', ok: false })
      }

      if (!itemReservado) {
        return reply.status(404).send({ error: 'Item reservado não encontrado', ok: false })
      }

      await itemReservado.destroy()

      await item.update(data)

      reply.send({ message: 'Item atualizado com sucesso', item, ok: true })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao atualizar item', ok: false })
    }
  })

  fastify.put("/produto/item/:id", async (request, reply) => {
    try{
      const itemId = request.params.id
      const data = request.body

      const item = await ItemEstoque.findByPk(itemId)

      if (!item) {
        return reply.status(404).send({ error: 'Item não encontrado', ok: false })
      }

      await item.update(data)

      reply.send({ message: 'Item atualizado com sucesso', item, ok: true })
    } catch(err){
      console.log(err)
      reply.code(500).send({ error: 'Erro ao atualizar item', ok: false })
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

export async function CadastroProduto(produtoData, imgFile){
  let imgPath = null
  if (imgFile && imgFile.buffer){
    const nomeUnico = `${randomUUID()}-${imgFile.filename}`;
    const blob = await put(nomeUnico, imgFile.buffer, {
      access: "public"
    })
    imgPath = blob.url // Salvamos a URL completa retornada pelo Vercel Blob
  }

  const { nome, descricao, categoria_id, itens } = produtoData

  let produto = await Produto.findOne({ where: { nome: nome}})

  if(!produto){
    produto = await Produto.create({ nome, descricao, categoria_id, itens, img: imgPath })
  }

  let itensCriados = []
  if (itens && itens.length > 0){
    const novosItens = itens.map(item => ({
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
    itensCriados = await ItemEstoque.bulkCreate(novosItens, { returning: true })
  }

  return { produto, itensEstoque: itensCriados }
}

export async function toBuffer(stream) {
  const chunks = []
  for await (const chunk of stream){
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}