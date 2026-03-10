import { fastify } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import process from "node:process";
import "dotenv/config";
import sequelize from "./database/sequelize.js";
import {
  produtoRoutes,
  categoriaRoutes,
  clienteRoutes,
  notaRoutes,
  vendaRoutes,
  notaVendaRoutes,
  contaRoutes,
  dashboardRoutes,
} from "./routes/routers.js";

const server = fastify({ logger: true, trustProxy: true });

const origins = [
  "http://localhost:5888",
  "http://127.0.0.1:5888",
  "http://192.168.8.226:5888",
];

const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

if (process.env.FRONTEND_URL === "ALL") {
  console.log("\n[CORS] Modo: Aberto (Ecoando Origem)");
  await server.register(cors, { ...corsOptions, origin: true });
} else {
  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
  console.log("\n[CORS] Modo: Restrito às seguintes origens:", origins);
  await server.register(cors, { ...corsOptions, origin: origins });
}

server.addHook("onRequest", async (request) => {
  console.log(
    `\n[REQUISICAO] ${request.method} ${request.url} - IP: ${request.ip}`,
  );
});

server.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

server.get("/", async (request, reply) => {
  const ip = request.ip.replace("::ffff:", "");
  console.log("Ip Cliente: ", ip);
  reply.code(200).send({ message: "Olá ", clientIp: ip });
});

server.register(produtoRoutes);
server.register(categoriaRoutes);
server.register(clienteRoutes);
server.register(notaRoutes);
server.register(vendaRoutes);
server.register(notaVendaRoutes);
server.register(contaRoutes);
server.register(dashboardRoutes);

async function start() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Conectou ao banco de dados com sucesso!");

    const port = process.env.PORT || 3333;
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    console.log("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
