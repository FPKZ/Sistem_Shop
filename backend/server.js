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
import multipart from "@fastify/multipart"
import process from "node:process"
import "dotenv/config"
import sequelize from "./database/sequelize.js";
import { produtoRoutes, categoriaRoutes, clienteRoutes, notaRoutes, vendaRoutes, notaVendaRoutes, contaRoutes } from "./routes/routers.js";
import { setTimeout } from "node:timers/promises";
//import { request } from "node:http";

const server = fastify({ logger: true, trustProxy: true })

const origins = [
  "http://localhost:5173",
]

if (process.env.FRONTEND_URL) {
  if (process.env.FRONTEND_URL === "ALL") {
    console.log("\n\nTodos aparelhos liberados \n\n Aparelho atual \n\n")
    await server.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    });
    
  }else{
    origins.push(process.env.FRONTEND_URL)
    console.log("Apenas aparelhos liberados")
    await server.register(cors, {
      origin: origins,
      methods: ["GET", "POST", "PUT", "DELETE"],
    });
  }
}else{
  console.log("Apenas aparelhos liberados")
  await server.register(cors, {
    origin: origins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
}


server.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
})


// GET http://localhost:3333/
// POST http://localhost:3333/
// PUT http://localhost:3333/509
// DELETE http://localhost:3333/509

server.get('/', async (request, reply) => {
  const ip = request.ip.replace('::ffff:', '');
  console.log("Ip Cliente: ", ip)

  // const e = await setTimeout(60000, 'esperando')

  // console.log(e)
  // await esperar()
  reply.code(200).send({message: "Olá ", clientIp: ip})
  // return 'Servidor rodando com Fastify e ES Modules!';
});

server.register(produtoRoutes);
server.register(categoriaRoutes);
server.register(clienteRoutes);
server.register(notaRoutes);
server.register(vendaRoutes);
server.register(notaVendaRoutes);
server.register(contaRoutes);


async function start(){
  try{
    await sequelize.sync({ alter: true })
    console.log("Conectou ao banco de dados com sucesso!")

    const port = process.env.PORT || 3333
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Servidor rodando na porta ${port}`)
  } catch(err){
    console.log("Erro ao iniciar o servidor:", err)
    process.exit(1)
  } 
}

start()