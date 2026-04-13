import api from "@services/http/client";
import { ApiResponse, NotaFiscal, NotaFiscalPayload } from "@services/types";

export async function getNotas(): Promise<ApiResponse<NotaFiscal[]>> {
  try {
    const data = await api.get("/notas");
    return data;
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function postNota(data: NotaFiscalPayload): Promise<ApiResponse<NotaFiscal>> {
  try {
    return await api.post("/nota", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function putNota(id: string | number, data: Partial<NotaFiscalPayload>): Promise<ApiResponse<{ nota: NotaFiscal }>> {
  try {
    return await api.put(`/nota/${id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteNota(id: string | number): Promise<ApiResponse> {
  try {
    return await api.delete(`/nota/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}
