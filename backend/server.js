// import {createServer} from "node:http"

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Ola Mundo');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
import { fastify } from "fastify";
import cors from "@fastify/cors"
import process from "node:process"

import { Produto, Categoria, Nota } from "./database/models/index.js";
import sequelize from "./database/sequelize.js";

const server = fastify()

const origins = [
  "http://localhost:5173",
]

if (process.env.FRONTEND_URL) {
  origins.push(process.env.FRONTEND_URL)
}

await server.register(cors, {
  origin: origins,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// GET http://localhost:3333/
// POST http://localhost:3333/
// PUT http://localhost:3333/509
// DELETE http://localhost:3333/509

server.get('/', async () => {
  return 'Servidor rodando com Fastify e ES Modules!';
});


server.get("/produtos", async (request, reply) => {
  try{
    const produtos = await Produto.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Nota, as: 'Nota' }
      ]
    })

    reply.send(produtos)
  } catch(err){
    console.log(err)
    reply.code(500).send({ error: 'Erro ao buscar produtos' })
  }
})

server.get("/notas", async (request, reply) => {
  try{
    const notas = await Nota.findAll({
      include: [
        { model: Produto, as: "produtos"},
      ]
    })

    reply.send(notas)
  } catch(err){
    console.log(err)
    reply.code(500).send({error: "Erro ao buscar Notas"})
  }
})

server.get("/categorias", async (request, reply) => {
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

server.post("/produto", async (request, reply) => {
  try{
    const query = request.query.query
    console.log(query)
    
    const data = request.body

    const novoProduto = await Produto.create(data)

    reply.code(201).send(novoProduto)
  } catch(err){
    console.log(err)
    reply.code(500).send({ error: 'Erro ao cadastrar produtos' })
  }
})
server.post("/categoria", async (request, reply) => {
  try{
    const query = request.query.query
    
    const data = request.body
    const novacategoria = await Categoria.create(data)

    reply.code(201).send(novacategoria)
  } catch(err){
    console.log(err)
    reply.code(500).send({error: "Erro ao cadastrar categoria"})
  }
})
server.post("/nota", async (request, reply) => {
  try{
    const data = request.body
    const novanota = await Nota.create(data)

    reply.code(201).send(novanota)
  } catch(err){
    console.log(err)
  reply.code(500).send({error: "Erro ao cadastrar nota"})
  }
})

server.put("/produto/:id", async (request, reply) => {
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
server.put("/categoria/:id", async (request, reply) => {
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
server.put("/nota/:id", async (request, reply) => {
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


server.delete("/produto/:id", async (request, reply) => {
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
server.delete("/categoria/:id", async (request, reply) => {
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
server.delete("/nota/:id", async (request, reply) => {
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


async function start(){
  try{
    await sequelize.sync({ alter: true })
    console.log("Conectou ao banco de dados com sucesso!")

    const port = process.env.PORT || 3333
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Servidor rodando na porta ${port}`)
  } catch(err){
    console.log("Erro ao iniciar o servidor:", err)
    //process.exit(1)
  } 
}

start()