import { fastify } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import process from "node:process";
import { env } from "./config/env.js";
import sequelize from "./database/sequelize.js";
import RegistarRotas from "./routes/routers.js";
import tableCores from "./database/interface/tableCores.js";
import { syncCacheToBlob } from "./services/cache.service.js";
import { limparImagensOrfas } from "./services/img.service.js";

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
}

// ──────────────────────────────────────────────
// Plugins
// ──────────────────────────────────────────────
server.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // Conta: 100 MegaBytes * 1024 KiloBytes * 1024 Bytes = 104.857.600 bytes

// ──────────────────────────────────────────────
// Decorators de Resposta Padronizados
// ──────────────────────────────────────────────
server.decorateReply("ok", function (data = {}, message = "Operação realizada com sucesso") {
  return this.code(this.statusCode === 200 ? 200 : this.statusCode).send({ ok: true, message, ...data });
});

server.decorateReply("err", function (error = "Ocorreu um erro", code = 400) {
  const message = error instanceof Error ? error.message : error;
  return this.code(code).send({ ok: false, error: message });
});

// ──────────────────────────────────────────────
// Hooks
// ──────────────────────────────────────────────
server.addHook("onRequest", async (request) => {
  server.log.info(`[REQUISICAO] ${request.method} ${request.url} - IP: ${request.ip}`);
});

// Prefixos de rotas cujas mutações afetam os dados do catálogo público.
// Apenas essas rotas disparam a sincronização do cache no Vercel Blob.
// Rotas como /venda, /nota, /cliente, /imagem não impactam dados públicos
// e não precisam re-gerar o cache a cada operação.
const ROTAS_QUE_AFETAM_CACHE = ["/produto", "/categoria", "/cores"];

server.addHook("onResponse", async (request, reply) => {
  const afetoCache = ROTAS_QUE_AFETAM_CACHE.some(r => request.url.startsWith(r));

  if (
    ["POST", "PUT", "DELETE"].includes(request.method) &&
    reply.statusCode >= 200 && reply.statusCode < 300 &&
    afetoCache
  ) {
    syncCacheToBlob(server.log).catch(err =>
      server.log.error("[CACHE] Falha na sincronização pós-requisição:", err)
    );
  }
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
server.register(RegistarRotas)

// ──────────────────────────────────────────────
// Inicialização
// ──────────────────────────────────────────────
async function start() {
  try {
    // DB_SYNC=true faz o Sequelize verificar e alterar colunas — útil em desenvolvimento.
    // Em produção (Render), deixar desligado para acelerar o boot.
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      server.log.info("[BD] Sincronizado com alter:true");
    } else {
      await sequelize.authenticate();
      server.log.info("[BD] Conexão verificada (sem sync)");
    }
    await server.listen({ port: env.PORT, host: "0.0.0.0" });

    const seedCores = new tableCores();
    await seedCores.seedCoresIniciais();

    // Sincroniza o cache estático no Vercel Blob para que esteja atualizado no primeiro boot
    syncCacheToBlob(server.log).catch(err => server.log.error("[CACHE] Falha na sincronização na inicialização:", err));

    // Agenda a limpeza de imagens órfãs (24 horas = 24 * 60 * 60 * 1000 ms)
    const INTERVALO_LIMPEZA = 24 * 60 * 60 * 1000;
    setInterval(() => {
        limparImagensOrfas().catch(err => server.log.error("[CLEANUP] Falha na limpeza agendada:", err));
    }, INTERVALO_LIMPEZA);

    // Executa uma limpeza inicial após 1 hora para não sobrecarregar o boot
    setTimeout(() => {
        limparImagensOrfas().catch(err => server.log.error("[CLEANUP] Falha na limpeza inicial:", err));
    }, 10 * 60 * 1000);

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
