import api from "@app/httpClient";

export async function getDashboard() {
  try {
    return await api.get("/dashboard");
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard consolidado", error);
  }
}
