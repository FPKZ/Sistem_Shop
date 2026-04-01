import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

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
    request.user = decoded; // disponibiliza o usuário decodificado na requisição
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return reply.code(401).send({ ok: false, error: "Token expirado. Faça login novamente." });
    }
    return reply.code(401).send({ ok: false, error: "Token inválido" });
  }
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
