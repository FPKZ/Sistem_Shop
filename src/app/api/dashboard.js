const back = import.meta.env.VITE_BACKEND_URL;

export async function getDashboard() {
  try {
    const response = await fetch(`${back}/dashboard`, { method: "GET" });
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard consolidado", error);
  }
}
