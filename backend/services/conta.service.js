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
  const conta = await Conta.findOne({ 
    where: { email }, 
    attributes: ["id", "email", "nome", "img", "cargo", "senha", "tokenVersion"] 
  });

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

  // Converter para objeto simples e remover a senha antes de gerar o token e retornar
  const contaData = conta.get({ plain: true });
  const { senha: _, ...contaSemSenha } = contaData;

  // Incluir cargo no JWT para que o middleware requireCargo possa validar nas rotas
  const token = jwt.sign(
    contaSemSenha,
    env.JWT_SECRET,
    { expiresIn: "4h" }
  );

  let permissoes = getPermissoes(contaSemSenha.cargo);
  // eslint-disable-next-line no-unused-vars
  permissoes = Object.fromEntries(Object.entries(permissoes).filter(([_,value]) => value === true));
  return { conta: contaSemSenha, token, permissoes };
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
  await conta.update({ senha: senhaHash, tokenVersion: (conta.tokenVersion || 0) + 1 });

  return { conta, senhaPadrao: SENHA_PADRAO_RESET };
}

export async function mudarSenha(id, senhaAtual, novaSenha) {
  const conta = await Conta.findOne({ 
    where: { id },
    attributes: ["id", "senha"]
  })

  if(!conta) throw new Error("Usuario não encontrado")
  
  const validate = await bcrypt.compare(senhaAtual, conta.senha)
  if(!validate) throw new Error("Senha atual incorreta")

  const novaSenhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS)
  await conta.update({ senha: novaSenhaHash, tokenVersion: (conta.tokenVersion || 0) + 1 })

  return { messager: "Senha alterada com sucesso!" };
}
