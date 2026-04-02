import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProdutosProps } from "./interfaces";
import api from "@app/httpClient";

// Funções de fetch (usando httpClient — rotas protegidas)
async function getProduto({ item = "", nome = "" }: getProdutosProps) {
  try {
    return await api.get(`/produtos?itens=${item}&nome=${nome}`);
  } catch (error) {
    console.error("Erro ao buscar produtos", error);
  }
}

export async function postProduto(data: any) {
  try {
    return await api.post("/produto", data);
  } catch (error) {
    console.error("Erro ao cadastrar produto", error);
  }
}

export async function reservarProduto(id: number, cliente: number) {
  try {
    return await api.put(`/produto/reservar/${id}?cliente_id=${cliente}`, {});
  } catch (error) {
    console.error("Erro ao reservar produto", error);
  }
}

export async function removerProduto(id: number, data: any) {
  try {
    return await api.put(`/produto/remover/${id}`, data);
  } catch (error) {
    console.error("Erro ao remover produto", error);
  }
}

export async function updateItemEstoque(id: number, data: any) {
  try {
    return await api.put(`/produto/item/${id}`, data);
  } catch (error) {
    console.error("Erro ao atualizar item", error);
  }
}

export async function deleteProduto(id: number) {
  try {
    await api.delete(`/produto/${id}`);
  } catch (error) {
    console.error("Erro ao deletar produto", error);
  }
}

export async function deleteItem(id: number) {
  try {
    await api.delete(`/produto/item/${id}`);
  } catch (error) {
    console.error("Erro ao deletar item", error);
  }
}

// Categorias
export async function getCategoria() {
  try {
    return await api.get("/categorias");
  } catch (error) {
    console.error("Erro ao buscar categorias", error);
  }
}
export async function getCores({ id = "", hex = "", name = "" }: any = {}) {
  try {
    console.log("entrou")
    return await api.get(`/cores?id=${id}&hex=${hex}&name=${name}`);
    
  } catch (error) {
    console.error("Erro ao buscar cores", error);
  }
}

export async function postCategoria(data: any) {
  try {
    return await api.post("/categoria", data);
  } catch (error) {
    console.error("Erro ao cadastrar categoria", error);
  }
}

export async function deleteCategoria(id: number) {
  try {
    await api.delete(`/categoria/${id}`);
  } catch (err) {
    console.error("Erro ao deletar Categoria", err);
  }
}

// React Query
export function getProdutos({ item, nome }: getProdutosProps = {}) {
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
