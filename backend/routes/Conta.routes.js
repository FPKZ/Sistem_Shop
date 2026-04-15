import { Conta } from "../database/models/index.js";
import Solicitacao from "../database/models/Solicitacao.js";
import pedidosRegistros from "../database/pedidos-registros.js";
import bcrypt from "bcryptjs";
import { autenticar, criarConta, resetarSenha, mudarSenha } from "../services/conta.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireCargo } from "../middlewares/auth.middleware.js";
import { getPermissoes, getAllPermissoes } from "../config/permissoes.js";

export default async function contaRoutes(fastify) {

  // Rotas Públicas
  fastify.post("/login", async (request, reply) => {
    const { email, senha } = request.body;
    const { conta, token, permissoes } = await autenticar(email, senha);
    return reply.ok({ conta, token, permissoes }, "Login bem-sucedido");
  });

  fastify.post("/register", async (request, reply) => {
    await pedidosRegistros.sync();
    const { nome, email, senha } = request.body;

    const existente = await Conta.findOne({ where: { email } });
    if (existente) return reply.err("Usuário já existe. Email já cadastrado.", 409);

    const novaSenha = await bcrypt.hash(senha, 10);
    const novaSolicitacao = await Solicitacao.create({ nome, email, senha: novaSenha });
    return reply.ok({ novaSolicitacao }, "Pedido de registro realizado com sucesso!");
  });

  // Rotas Protegidas
  fastify.get("/contas", { preHandler: authMiddleware }, async (request, reply) => {
    const contas = await Conta.findAll();
    return reply.code(200).send(contas);
  });

  fastify.post("/cadastrar-conta", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const novaConta = await criarConta(request.body);
    return reply.code(201).ok({ novaConta }, "Conta cadastrada com sucesso!");
  });

  fastify.put("/editar-user/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const conta = await Conta.findByPk(request.params.id);
    if (!conta) return reply.err("Usuário não encontrado", 404);
    await conta.update(request.body);
    return reply.ok({ conta }, "Usuário alterado com sucesso!");
  });

  fastify.put("/reset-senha/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const { conta, senhaPadrao } = await resetarSenha(request.params.id);
    return reply.ok({ conta, senhaPadrao }, "Senha redefinida com sucesso!");
  });

  fastify.put("/mudar-senha", { preHandler: authMiddleware }, async (request, reply) => {
    try{
      const { id, senhaAtual, novaSenha } = request.body;
      const user = request.user;
  
      if (user.id !== id) return reply.err("Não autorizado", 403);
      const result = await mudarSenha(id, senhaAtual, novaSenha)
      return reply.ok({ result });
    } catch (err) {
      reply.err(err)
    }
  })

  fastify.delete("/delete-user/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const conta = await Conta.findByPk(request.params.id);
    if (!conta) return reply.err("Conta não encontrada", 404);
    await conta.destroy();
    return reply.ok({}, "Conta deletada com sucesso");
  });

  fastify.get("/pendentes", { preHandler: authMiddleware }, async (request, reply) => {
    const solicitacoes = await Solicitacao.findAll({ where: { status: "pendente" } });
    return reply.code(200).send(solicitacoes);
  });

  fastify.put("/aprovar/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const solicitacao = await Solicitacao.findByPk(request.params.id);
    if (!solicitacao) return reply.err("Solicitação não encontrada", 404);

    const novaConta = await Conta.create({
      nome:   solicitacao.nome,
      email:  solicitacao.email,
      senha:  solicitacao.senha,
      cargo:  "User",
    });

    await solicitacao.destroy();
    return reply.ok({ novaConta }, "Solicitação aprovada!");
  });

  fastify.delete("/negar/:id", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    const solicitacao = await Solicitacao.findByPk(request.params.id);
    if (!solicitacao) return reply.err("Solicitação não encontrada", 404);
    await solicitacao.destroy();
    return reply.ok({}, "Solicitação negada!");
  });

  /**
   * Rota de validação de sessão.
   * Chamada pelo frontend no boot para confirmar que o usuário ainda existe no banco.
   * Se o usuário foi deletado ou não existe, retorna 404 → frontend faz logout.
   */
  fastify.get("/perfil", { preHandler: authMiddleware }, async (request, reply) => {
    const conta = await Conta.findByPk(request.user.id, {
      attributes: { exclude: ["senha"] },
    });
    if (!conta) return reply.err("Usuário não encontrado", 404);
    let permissoes = getPermissoes(conta.cargo);
    permissoes = Object.fromEntries(Object.entries(permissoes).filter(([_,value]) => value === true));
    return reply.ok({ conta, permissoes }, "Perfil carregado com sucesso");
  });

  fastify.get("/permissions", { preHandler: [authMiddleware, requireCargo("admin")] }, async (request, reply) => {
    try{
      return reply.ok({ permissoes: getAllPermissoes() })
    } catch (err) {
      return reply.err(err)
    }
  })
}
