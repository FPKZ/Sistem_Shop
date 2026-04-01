import api from "@app/httpClient";

// Rotas públicas — usa fetch puro (sem token)
const back = import.meta.env.VITE_BACKEND_URL;

export async function login(data) {
  try {
    const response = await fetch(`${back}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao fazer login", error);
  }
}

export async function registerUser(data) {
  try {
    const response = await fetch(`${back}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar usuário", error);
  }
}

// Rota protegida
export async function postConta(data) {
  try {
    return await api.post("/cadastrar-conta", data);
  } catch (error) {
    console.error("Erro ao cadastrar conta", error);
  }
}