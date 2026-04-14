import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@services/http/client";
import { ApiResponse, Produto, ProdutoFiltros, ItemEstoque, Categoria, Cor, CategoriaFiltros } from "@services/types";

// Funções de fetch (usando httpClient — rotas protegidas)
export async function getProduto({ item, nome }: ProdutoFiltros = {}): Promise<ApiResponse<Produto[]>> {
  try {
    const query = new URLSearchParams({ itens: item || "", nome: nome || "" }).toString();
    return await api.get(`/produtos?${query}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function postProduto(data: any): Promise<ApiResponse<Produto>> {
  try {
    return await api.post("/produto", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function postImagens(files: File[]): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("imagens", file);
    });
    return await api.post("/imagens/salvar", formData);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function updateProduto(id: number | string, data: Partial<Produto>): Promise<ApiResponse<Produto>> {
  try {
    return await api.put(`/produto/${id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteImagem(url: string): Promise<ApiResponse> {
  try {
    return await api.delete("/imagen/deletar", { url });
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function reservarProduto(id: number | string, cliente: number | string): Promise<ApiResponse> {
  try {
    return await api.put(`/produto/reservar/${id}?cliente_id=${cliente}`, {});
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function removerProduto(id: number | string, data: Partial<Produto>): Promise<ApiResponse> {
  try {
    return await api.put(`/produto/remover/${id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function updateItemEstoque(id: number | string, data: Partial<ItemEstoque>): Promise<ApiResponse<ItemEstoque>> {
  try {
    return await api.put(`/produto/item/${id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteProduto(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/produto/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteItem(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/produto/item/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

// Categorias
export async function getCategoria(): Promise<ApiResponse<Categoria[]>> {
  try {
    return await api.get("/categorias");
  } catch (err) { console.error("Erro na API", err); throw err; }
}
export async function getCores({ id = "", hex = "", name = "" }: CategoriaFiltros = {}): Promise<ApiResponse<Cor[]>> {
  try {
    const query = new URLSearchParams({ id: String(id), hex, name }).toString();
    return await api.get(`/cores?${query}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function postCategoria(data: Partial<Categoria>): Promise<ApiResponse<Categoria>> {
  try {
    return await api.post("/categoria", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

export async function deleteCategoria(id: number | string): Promise<ApiResponse> {
  try {
    return await api.delete(`/categoria/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

// React Query
export function getProdutos({ item, nome }: ProdutoFiltros = {}) {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: () => getProduto({ item, nome }),
  });
}

export function useCadastrarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postProduto(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["produtos"] }); },
  });
}

export function useDeletarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduto(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["produtos"] }); },
  });
}

export function useDeletarItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["produtos"] }); },
  });
}

export function useAtualizarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Produto> }) =>
      updateProduto(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["produtos"] }); },
  });
}
