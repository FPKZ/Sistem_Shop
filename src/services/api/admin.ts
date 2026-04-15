import api from "@services/http/client";
import { ApiResponse, Usuario } from "@services/types";

export interface Solicitacao {
  id: number;
  userId: number;
  status: string;
}

export async function getUsers(): Promise<Usuario[]> {
  try {
    const data: any = await api.get("/contas");
    return data.contas ?? data;
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function cadastrarUser(data: Partial<Usuario>): Promise<ApiResponse<Usuario>> {
  try {
    return await api.post("/cadastrar-conta", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function editarUser(data: Partial<Usuario> & { id: number | string }): Promise<ApiResponse<Usuario>> {
  try {
    console.log(data)
    return await api.put(`/editar-user/${data.id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function resetSenha(id: number | string): Promise<ApiResponse> {
  try {
    return await api.put(`/reset-senha/${id}`, {});
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteUser(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/delete-user/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function getSolicitacoes(): Promise<Solicitacao[]> {
  try {
    const data: any = await api.get("/pendentes");
    return data.solicitacoes ?? data;
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function aproveSolicitacoes(id: number | string): Promise<ApiResponse> {
  try {
    return await api.put(`/aprovar/${id}`, {});
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteSolicitacao(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/negar/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}
