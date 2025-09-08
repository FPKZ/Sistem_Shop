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

await server.register(cors, {
  origin: "http://localhost:5173", // ou true para liberar geral
  methods: ["GET", "POST", "PUT", "DELETE"], // libera DELETE
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

server.post("/produto", async (request, reply) => {
  try{
    const query = request.query.query
    console.log(query)
    
    const data = request.body

    const novoProduto = await Produto.create(data)

    reply.code(201).send(novoProduto)
  } catch(err){
    console.log(err)
    reply.code(500).send({ error: 'Erro ao buscar produtos' })
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