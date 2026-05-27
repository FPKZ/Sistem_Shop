import { Conta } from "../database/models/index.js";
import Solicitacao from "../database/models/Solicitacao.js";
import pedidosRegistros from "../database/pedidos-registros.js";
import bcrypt from "bcryptjs";
import {
  autenticar,
  criarConta,
  resetarSenha,
  mudarSenha,
} from "../services/conta.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireCargo } from "../middlewares/auth.middleware.js";
import { getPermissoes, getAllPermissoes } from "../config/permissoes.js";

export default async function contaRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const loginSchema = {
    description: "Autentica um usuário e retorna o token JWT",
    tags: ["Autenticação"],
    body: {
      type: "object",
      required: ["email", "senha"],
      properties: {
        email: { type: "string", format: "email", examples: ["admin@loja.com"] },
        senha: { type: "string", examples: ["123456"] }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          message: { type: "string" },
          conta: {
            type: "object",
            properties: {
              id: { type: "number" },
              nome: { type: "string" },
              email: { type: "string" },
              cargo: { type: "string" }
            }
          },
          token: { type: "string" },
          permissoes: { type: "object" }
        }
      }
    }
  };

  const registerSchema = {
    description: "Solicita a criação de uma nova conta de usuário",
    tags: ["Autenticação"],
    body: {
      type: "object",
      required: ["nome", "email", "senha"],
      properties: {
        nome: { type: "string", examples: ["Fulano de Tal"] },
        email: { type: "string", format: "email", examples: ["fulano@loja.com"] },
        senha: { type: "string", examples: ["123456"] }
      }
    }
  };

  // Rotas Públicas
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, senha } = request.body;
    const { conta, token, permissoes } = await autenticar(email, senha);
    return reply.ok({ conta, token, permissoes }, "Login bem-sucedido");
  });

  fastify.post("/register", { schema: registerSchema }, async (request, reply) => {
    await pedidosRegistros.sync();
    const { nome, email, senha } = request.body;

    const existente = await Conta.findOne({ where: { email } });
    if (existente)
      return reply.err("Usuário já existe. Email já cadastrado.", 409);

    const novaSenha = await bcrypt.hash(senha, 10);
    const novaSolicitacao = await Solicitacao.create({
      nome,
      email,
      senha: novaSenha,
    });
    return reply.ok(
      { novaSolicitacao },
      "Pedido de registro realizado com sucesso!",
    );
  });

  // Rotas Protegidas
  fastify.get(
    "/contas",
    {
      schema: {
        description: "Lista todas as contas cadastradas (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }]
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const contas = await Conta.findAll({
        attributes: { exclude: ["senha"] },
      });
      return reply.code(200).send(contas);
    },
  );

  fastify.post(
    "/cadastrar-conta",
    {
      schema: {
        description: "Cadastra uma nova conta diretamente no sistema (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        body: {
          type: "object",
          required: ["nome", "email", "senha", "cargo"],
          properties: {
            nome: { type: "string", examples: ["Novo Usuário"] },
            email: { type: "string", format: "email", examples: ["novo@loja.com"] },
            senha: { type: "string", examples: ["123456"] },
            cargo: { type: "string", enum: ["admin", "gerente", "vendedor", "User"], examples: ["vendedor"] }
          }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      await criarConta(request.body);
      return reply.ok({ message: "Conta cadastrada com sucesso!" }, 201);
    },
  );

  fastify.put(
    "/user-edit/:id",
    {
      schema: {
        description: "Permite que o próprio usuário edite seus dados cadastrais (nome, e-mail e avatar)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        },
        body: {
          type: "object",
          properties: {
            nome: { type: "string", examples: ["João da Silva"] },
            email: { type: "string", examples: ["joao@email.com"] },
            img: { type: "string", examples: ["https://url-da-imagem.com/avatar.jpg"] },
          },
        },
      },
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        const conta = await Conta.findByPk(request.params.id);
        const user = request.user;

        if (user.id !== conta.id) throw new Error("Não autorizado", 403);

        if (!conta) throw new Error("Usuário não encontrado", 404);

        if (Object.keys(request.body).length === 0) throw new Error("Nenhum dado para atualizar", 400);

        const { nome, email, img } = request.body;

        if (email) {
          const existente = await Conta.findOne({ where: { email } });
          if (existente) throw new Error("Email já cadastrado", 409);
        }

        await conta.update({ nome, email, img });

        return reply.ok({ conta }, "Usuário alterado com sucesso!");
      } catch (err) {
        return reply.err(err);
      }
    },
  );

  fastify.put(
    "/editar-user/:id",
    {
      schema: {
        description: "Permite que um Admin edite os dados de qualquer conta do sistema",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        },
        body: {
          type: "object",
          properties: {
            nome: { type: "string", examples: ["Nome Atualizado"] },
            email: { type: "string", examples: ["email@atualizado.com"] },
            cargo: { type: "string", enum: ["admin", "gerente", "vendedor", "User"], examples: ["gerente"] },
            img: { type: "string", examples: ["https://url-da-imagem.com/avatar.jpg"] }
          }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const conta = await Conta.findByPk(request.params.id);
      if (!conta) return reply.err("Usuário não encontrado", 404);
      await conta.update(request.body);
      return reply.ok({ conta }, "Usuário alterado com sucesso!");
    },
  );

  fastify.put(
    "/reset-senha/:id",
    {
      schema: {
        description: "Redefine a senha de um usuário para o valor padrão do sistema (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      await resetarSenha(request.params.id);
      return reply.ok({}, "Senha redefinida com sucesso!");
    },
  );

  fastify.put(
    "/mudar-senha",
    {
      schema: {
        description: "Permite que o próprio usuário troque sua senha fornecendo a senha atual e a nova",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        body: {
          type: "object",
          required: ["id", "senhaAtual", "novaSenha"],
          properties: {
            id: { type: "number", examples: [1] },
            senhaAtual: { type: "string", examples: ["senhaAntiga123"] },
            novaSenha: { type: "string", examples: ["novaSenha456"] },
          },
        },
      },
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        const { id, senhaAtual, novaSenha } = request.body;
        const user = request.user;

        if (user.id !== id) return reply.err("Não autorizado", 403);
        const result = await mudarSenha(id, senhaAtual, novaSenha);
        return reply.ok({ result });
      } catch (err) {
        reply.err(err);
      }
    },
  );

  fastify.delete(
    "/delete-user/:id",
    {
      schema: {
        description: "Remove permanentemente uma conta de usuário do sistema (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const conta = await Conta.findByPk(request.params.id);
      if (!conta) return reply.err("Conta não encontrada", 404);
      await conta.destroy();
      return reply.ok({}, "Conta deletada com sucesso");
    },
  );

  fastify.get(
    "/pendentes",
    {
      schema: {
        description: "Lista as solicitações de cadastro pendentes de aprovação (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }]
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const solicitacoes = await Solicitacao.findAll({
        where: { status: "pendente" },
      });
      return reply.code(200).send(solicitacoes);
    },
  );

  fastify.put(
    "/aprovar/:id",
    {
      schema: {
        description: "Aprova uma solicitação de cadastro pendente, criando a conta do usuário (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const solicitacao = await Solicitacao.findByPk(request.params.id);
      if (!solicitacao) return reply.err("Solicitação não encontrada", 404);

      const novaConta = await Conta.create({
        nome: solicitacao.nome,
        email: solicitacao.email,
        senha: solicitacao.senha,
        cargo: "User",
      });

      await solicitacao.destroy();
      const conta = novaConta.get({
        plain: true,
        attributes: { exclude: ["senha"] },
      });
      return reply.ok({ conta }, "Solicitação aprovada!");
    },
  );

  fastify.delete(
    "/negar/:id",
    {
      schema: {
        description: "Nega e remove uma solicitação de cadastro pendente (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "number", examples: [1] } }
        }
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      const solicitacao = await Solicitacao.findByPk(request.params.id);
      if (!solicitacao) return reply.err("Solicitação não encontrada", 404);
      await solicitacao.destroy();
      return reply.ok({}, "Solicitação negada!");
    },
  );

  /**
   * Rota de validação de sessão.
   * Chamada pelo frontend no boot para confirmar que o usuário ainda existe no banco.
   * Se o usuário foi deletado ou não existe, retorna 404 → frontend faz logout.
   */
  fastify.get(
    "/perfil",
    {
      schema: {
        description: "Retorna os dados do usuário autenticado e suas permissões de acesso. Usado pelo frontend para validar sessão",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }]
      },
      preHandler: authMiddleware
    },
    async (request, reply) => {
      const conta = await Conta.findByPk(request.user.id, {
        attributes: { exclude: ["senha"] },
      });
      if (!conta) return reply.err("Usuário não encontrado", 404);
      let permissoes = getPermissoes(conta.cargo);
      permissoes = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(permissoes).filter(([_, value]) => value === true),
      );
      return reply.ok({ conta, permissoes }, "Perfil carregado com sucesso");
    },
  );

  fastify.get(
    "/permissions",
    {
      schema: {
        description: "Retorna a lista completa de permissões disponíveis no sistema (Apenas Admin)",
        tags: ["Conta"],
        security: [{ BearerAuth: [] }]
      },
      preHandler: [authMiddleware, requireCargo("admin")]
    },
    async (request, reply) => {
      try {
        return reply.ok({ permissoes: getAllPermissoes() });
      } catch (err) {
        return reply.err(err);
      }
    },
  );
}
