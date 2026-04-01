import { gerarDashboard } from "../services/dashboard.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export default async function dashboardRoutes(fastify) {

  fastify.get("/dashboard", { preHandler: authMiddleware }, async (request, reply) => {
    const dados = await gerarDashboard();
    return reply.code(200).send(dados);
  });
}
