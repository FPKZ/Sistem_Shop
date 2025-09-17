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
import staticPlugin from "@fastify/static"
import { fileURLToPath } from "node:url";
import path from "node:path"
import process from "node:process"
import sequelize from "./database/sequelize.js";
import { produtoRoutes, categoriaRoutes, clienteRoutes, notaRoutes, vendaRoutes, notaVendaRoutes } from "./routes/routers.js";
//import { request } from "node:http";

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

server.register(multipart)

const  uploadDir = path.join(process.cwd(), "backend", "uploads")
server.register(staticPlugin, {
  root: uploadDir,
  prefix: "/uploads/",
})

// GET http://localhost:3333/
// POST http://localhost:3333/
// PUT http://localhost:3333/509
// DELETE http://localhost:3333/509

server.get('/', async () => {
  return 'Servidor rodando com Fastify e ES Modules!';
});

server.register(produtoRoutes);
server.register(categoriaRoutes);
server.register(clienteRoutes);
server.register(notaRoutes);
server.register(vendaRoutes);
server.register(notaVendaRoutes);


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