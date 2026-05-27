import { gerarDashboard } from "../services/dashboard.service.js";
import { authMiddleware, requirePermissao } from "../middlewares/auth.middleware.js";

export default async function dashboardRoutes(fastify) {
  const getDashboardSchema = {
    description: "Retorna dados consolidados de estoque, vendas e financeiro para o painel principal",
    tags: ["Dashboard"],
    security: [{ BearerAuth: [] }]
  };

  fastify.get("/dashboard", { schema: getDashboardSchema, preHandler: [authMiddleware, requirePermissao("verDashboard")] }, async (request, reply) => {
    try{
      const user = request.user;
      const dados = await gerarDashboard(user);
      return reply.ok(dados);
    }catch(err){
      return reply.err(err.message, err.statusCode);
    }
  });
}
