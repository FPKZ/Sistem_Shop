import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Conta } from "../database/models/index.js";

/**
 * Middleware Fastify de autenticação JWT.
 * Verifica o token no header Authorization: Bearer <token>.
 * 
 * Uso: registrar como preHandler nas rotas protegidas ou globalmente com exclusão das públicas.
 * 
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 */
export async function authMiddleware(request, reply) {
  const authHeader = request.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ ok: false, error: "Token de autenticação não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Verificação de segurança: Invalidação de token via versão
    const userDb = await Conta.findByPk(decoded.id, { attributes: ['id', 'tokenVersion'] });
    
    if (!userDb || userDb.tokenVersion !== decoded.tokenVersion) {
      return reply.code(401).send({ ok: false, error: "Sessão inválida. Por favor, faça login novamente." });
    }

    request.user = decoded; // disponibiliza o usuário decodificado na requisição
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return reply.code(401).send({ ok: false, error: "Token expirado. Faça login novamente." });
    }
    return reply.code(401).send({ ok: false, error: "Token inválido" });
  }
}

/**
 * Middleware factory de autorização por cargo (RBAC).
 * Verifica se o usuário logado tem o cargo necessário para acessar a rota.
 * Deve ser usado APÓS o authMiddleware (que popula request.user).
 *
 * @param {...string} cargos - Cargos permitidos (ex: "Admin", "Gerente")
 * @returns {Function} Middleware do Fastify
 *
 * @example
 * fastify.delete("/rota", { preHandler: [authMiddleware, requireCargo("Admin")] }, handler)
 */
export function requireCargo(...cargos) {
  return async function (request, reply) {
    const cargoUsuario = request.user?.cargo;
    if (!cargoUsuario || !cargos.includes(cargoUsuario)) {
      return reply.code(403).send({
        ok: false,
        error: `Acesso negado. Apenas ${cargos.join(" ou ")} pode executar esta ação.`,
      });
    }
  };
}

/**
 * Lista de rotas públicas que não precisam de autenticação.
 * Formato: "METHOD /path"
 */
export const PUBLIC_ROUTES = new Set([
  "POST /login",
  "POST /register",
  "GET /catalogo",
  "POST /pedido",
]);
