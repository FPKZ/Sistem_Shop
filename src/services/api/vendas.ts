import api from "@services/http/client";
import { ApiResponse, Venda, VendaPayload, NotaFiscalPayload, NotaFiscal } from "@services/types";

// Vendas
export async function getVendaById(id: number | string): Promise<ApiResponse<Venda>> {
  try {
    return await api.get(`/venda/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function postVenda(data: VendaPayload): Promise<ApiResponse<Venda>> {
  try {
    return await api.post("/venda", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteVenda(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/venda/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function getVendas(): Promise<ApiResponse<Venda[]>> {
  try {
    return await api.get("/vendas");
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function getVendasDashboard() {
  try {
    return await api.get("/vendas/dashboard");
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function putFinalizarVenda(id: number | string, data: Partial<VendaPayload>): Promise<ApiResponse<{ venda: Venda }>> {
  try {
    return await api.put(`/venda/${id}/finalizar`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function putEstorno(id: number | string): Promise<ApiResponse<{ venda: Venda }>> {
  try {
    return await api.put(`/venda/${id}/estorno`, {});
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function putDevolucao(id: number | string, data: Partial<VendaPayload>): Promise<ApiResponse<{ venda: Venda }>> {
  try {
    return await api.put(`/venda/${id}/devolucao`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

// Notas de Venda
export async function getNotaVendas(): Promise<ApiResponse<NotaFiscal[]>> {
  try {
    return await api.get("/notasVendas");
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function putNotaVenda(data: NotaFiscalPayload): Promise<ApiResponse<NotaFiscal>> {
  try {
    return await api.post("/notaVenda", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteNotaVenda(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/notaVenda/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}
