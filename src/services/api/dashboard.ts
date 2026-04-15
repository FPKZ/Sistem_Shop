import api from "@services/http/client";
import { ApiResponse, DashboardPayload } from "@services/types";

export async function getDashboard(): Promise<ApiResponse<DashboardPayload>> {
  try {
    return await api.get("/dashboard");
  } catch (err) { console.error("Erro na API", err); throw err; }
}
