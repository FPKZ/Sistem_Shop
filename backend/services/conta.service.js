import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Conta } from "../database/models/index.js";
import { env } from "../config/env.js";
import { getPermissoes } from "../config/permissoes.js";

const SALT_ROUNDS = 10;
const SENHA_PADRAO_RESET = "mudar123";

/**
 * Autentica um usuário por email e senha.
 * @param {string} email
 * @param {string} senha
 * @returns {Promise<{ conta: Conta, token: string }>}
 * @throws {Error} com statusCode 401 se credenciais inválidas
 */
export async function autenticar(email, senha) {
  const conta = await Conta.findOne({ where: { email } });

  if (!conta) {
    const err = new Error("Credenciais inválidas");
    err.statusCode = 401;
    throw err;
  }

  const senhaValida = await bcrypt.compare(senha, conta.senha);
  if (!senhaValida) {
    const err = new Error("Credenciais inválidas");
    err.statusCode = 401;
    throw err;
  }

  // Incluir cargo no JWT para que o middleware requireCargo possa validar nas rotas
  const token = jwt.sign(
    { id: conta.id, email: conta.email, nome: conta.nome, img: conta.img, cargo: conta.cargo },
    env.JWT_SECRET,
    { expiresIn: "4h" }
  );

  const permissoes = getPermissoes(conta.cargo);

  return { conta, token, permissoes };
}

/**
 * Cria uma nova conta com senha hasheada.
 * @param {object} data - Dados da conta (nome, email, senha, ...)
 * @returns {Promise<Conta>}
 */
export async function criarConta(data) {
  const existente = await Conta.findOne({ where: { email: data.email } });
  if (existente) {
    const err = new Error("Usuário já existe");
    err.statusCode = 409;
    throw err;
  }

  const senhaHash = await bcrypt.hash(data.senha, SALT_ROUNDS);
  return Conta.create({ ...data, senha: senhaHash });
}

/**
 * Reseta a senha de uma conta para o valor padrão.
 * @param {string|number} id
 * @returns {Promise<{ conta: Conta, senhaPadrao: string }>}
 */
export async function resetarSenha(id) {
  const conta = await Conta.findByPk(id);
  if (!conta) {
    const err = new Error("Usuário não encontrado");
    err.statusCode = 404;
    throw err;
  }

  const senhaHash = await bcrypt.hash(SENHA_PADRAO_RESET, SALT_ROUNDS);
  await conta.update({ senha: senhaHash });

  return { conta, senhaPadrao: SENHA_PADRAO_RESET };
}
