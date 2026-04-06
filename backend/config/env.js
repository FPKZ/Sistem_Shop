import "dotenv/config";
import process from "node:process";

/**
 * Variáveis de ambiente centralizadas e validadas.
 * Falha na inicialização se uma variável obrigatória estiver ausente.
 */
function require(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[ENV] A variável de ambiente '${key}' não está definida.`);
  }
  return value;
}

export const env = {
  // Banco de dados
  DATABASE_URL: require("DATABASE_URL"),

  // Autenticação
  JWT_SECRET: process.env.JWT_SECRET || process.env.VITE_CRYPTO_KEY || (() => { throw new Error("[ENV] 'JWT_SECRET' ou 'VITE_CRYPTO_KEY' não definido.") })(),

  // Servidor
  PORT: process.env.PORT || 3333,
  FRONTEND_URL: process.env.FRONTEND_URL,

  // Negócio
  WHATSAPP_NUMBER: process.env.VITE_WHATSAPP_NUMBER || "5513997062443",
};

export default env;
