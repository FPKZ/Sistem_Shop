import api from "@services/http/client";
import { ApiResponse, LoginResponse, Usuario } from "@services/types";

// Rotas públicas — usa fetch puro (sem token)
const back = import.meta.env.VITE_BACKEND_URL;

export async function login(data: Record<string, any>): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${back}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function registerUser(data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
  try {
    const response = await fetch(`${back}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) { console.error("Erro na API", err); throw err; }
}

// Rotas protegidas
export async function postConta(data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
  try {
    return await api.post("/cadastrar-conta", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

/**
 * Valida a sessão atual consultando o banco de dados.
 * Se o usuário não existir mais (deletado), o backend retorna 404
 * e o httpClient dispara o evento 'auth:401', forçando logout.
 */
export async function getPerfil(): Promise<ApiResponse<{ conta: Usuario }>> {
  try {
    return await api.get("/perfil");
  } catch (err) { console.error("Erro ao buscar perfil", err); throw err; }
}
