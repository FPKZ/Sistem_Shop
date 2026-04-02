import { fastify } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import process from "node:process";
import { env } from "./config/env.js";
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
  catalogoRoutes,
  coresRoutes,
} from "./routes/routers.js";
import tableCores from "./database/interface/tableCores.js";

const server = fastify({ logger: true, trustProxy: true });

// ──────────────────────────────────────────────
// CORS
// ──────────────────────────────────────────────
const CORS_OPTIONS = {
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"],
  credentials: true,
};

const origins = [
  "http://localhost:5888",
  "http://127.0.0.1:5888",
  "http://192.168.8.226:5888",
];

if (env.FRONTEND_URL === "ALL") {
  console.log("\n[CORS] Modo: Aberto (Ecoando Origem)");
  await server.register(cors, { ...CORS_OPTIONS, origin: true });
} else {
  if (env.FRONTEND_URL) origins.push(env.FRONTEND_URL);
  console.log("\n[CORS] Modo: Restrito às seguintes origens:", origins);
  await server.register(cors, { ...CORS_OPTIONS, origin: origins });
}

// ──────────────────────────────────────────────
// Plugins
// ──────────────────────────────────────────────
server.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });

// ──────────────────────────────────────────────
// Decorators de Resposta Padronizados
// ──────────────────────────────────────────────
server.decorateReply("ok", function (data = {}, message = "Operação realizada com sucesso") {
  return this.code(this.statusCode === 200 ? 200 : this.statusCode).send({ ok: true, message, ...data });
});

server.decorateReply("err", function (message = "Ocorreu um erro", code = 400) {
  return this.code(code).send({ ok: false, error: message });
});

// ──────────────────────────────────────────────
// Hooks
// ──────────────────────────────────────────────
server.addHook("onRequest", async (request) => {
  server.log.info(`[REQUISICAO] ${request.method} ${request.url} - IP: ${request.ip}`);
});

// ──────────────────────────────────────────────
// Tratamento de Erros Global
// ──────────────────────────────────────────────
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);

  // Erros de negócio lançados pelos services com statusCode
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Erro interno no servidor" : error.message;

  reply.code(statusCode).send({ ok: false, error: message });
});

// ──────────────────────────────────────────────
// Rota de Health Check
// ──────────────────────────────────────────────
server.get("/", async (request, reply) => {
  const ip = request.ip.replace("::ffff:", "");
  return reply.code(200).send({ ok: true, message: "API online", clientIp: ip });
});

// ──────────────────────────────────────────────
// Registro de Rotas
// ──────────────────────────────────────────────
server.register(produtoRoutes);
server.register(categoriaRoutes);
server.register(clienteRoutes);
server.register(notaRoutes);
server.register(vendaRoutes);
server.register(notaVendaRoutes);
server.register(contaRoutes);
server.register(dashboardRoutes);
server.register(catalogoRoutes);
server.register(coresRoutes);

// ──────────────────────────────────────────────
// Inicialização
// ──────────────────────────────────────────────
async function start() {
  try {
    await sequelize.sync({ alter: true });
    server.log.info("Conectado ao banco de dados com sucesso!");
    await server.listen({ port: env.PORT, host: "0.0.0.0" });

    const seedCores = new tableCores();
    await seedCores.seedCoresIniciais();

  } catch (err) {
    server.log.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

start();
