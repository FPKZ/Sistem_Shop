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
import { database } from "./database/memory-database.js";
import { request } from "http";
import cors from "@fastify/cors"

const server = fastify()

await server.register(cors, {
  origin: "http://localhost:5173", // ou true para liberar geral
  methods: ["GET", "POST", "PUT", "DELETE"], // libera DELETE
});

// GET http://localhost:3333/
// POST http://localhost:3333/
// PUT http://localhost:3333/509
// DELETE http://localhost:3333/509

const data = new database()

server.get("/videos", (request) => {
  const query = request.query.query
  console.log(query)
  
  const video = data.list(query)

  return video
})

server.post("/videos", (request, reply) => {
  const {titulo, descricao, duracao} = request.body
  
  data.create({
    titulo: titulo,
    descricao: descricao,
    duracao: duracao,
  })
  //caso o nome da variavel seja o msm do conteudo isso tambem é possivel
  // data.create({
  //   titulo,
  //   descricao,
  //   duracao,
  // })
  console.log(data.list())

  return reply.status(201).send() // 201 algo foi criado
})

server.put("/videos/:id", (request, replay) => {
  const video = request.params.id
  const {titulo, descricao, duracao} = request.body

  //caso o nome da variavel seja o msm do conteudo isso tambem é possivel
  data.atualizar(video, {
    titulo,
    descricao,
    duracao,
  })

  //console.log(video)
  return replay.status(204).send() // 204 sucesso mas sem conteudo de resposta

})
server.delete("/videos/:id", (request, replay) => {
  const video = request.params.id
  
  data.delete(video)
  return replay.status(204).send()
})

server.listen({
  port: 3333,
})

