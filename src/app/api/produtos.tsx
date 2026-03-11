import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProdutosProps, ItemEstoque } from "./interfaces";

const back = import.meta.env.VITE_BACKEND_URL;

//Produtos
async function getProduto({ item = "", nome = "" }: getProdutosProps) {
  try {
    //console.log({item, nome})
    const produtos = await (
      await fetch(`${back}/produtos?itens=${item}&nome=${nome}`, {
        method: "GET",
      })
    ).json();
    //console.log(produtos);
    return produtos;
  } catch (error) {
    console.error("Erro ao buscar produtos", error);
  }
}

export async function postProduto(data: any) {
  try {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${back}/produto`, {
      method: "POST",
      headers: isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao cadastrar produto", error);
  }
}

export async function reservarProduto(id: number, cliente: number) {
  try {
    const response = await fetch(
      `${back}/produto/reservar/${id}?cliente_id=${cliente}`,
      {
        method: "PUT",
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao reservar produto", error);
  }
}

export async function removerProduto(id: number, data: any) {
  try {
    const response = await fetch(`${back}/produto/remover/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao remover produto", error);
  }
}

export async function updateItemEstoque(id: number, data: any) {
  try {
    const response = await fetch(`${back}/produto/item/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao atualizar item", error);
  }
}

export async function deleteProduto(id: number) {
  try {
    await fetch(`${back}/produto/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Erro ao deletar produto", error);
  }
}

export async function deleteItem(id: number) {
  try {
    await fetch(`${back}/produto/item/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Erro ao deletar item", error);
  }
}

//Categorias
export async function getCategoria() {
  try {
    const categorias = await (
      await fetch(`${back}/categorias`, { method: "GET" })
    ).json();
    //onsole.log(categorias);
    return categorias;
  } catch (error) {
    console.error("Erro ao buscar categorias", error);
  }
}

export async function postCategoria(data: any) {
  try {
    const response = await fetch(`${back}/categoria`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //console.log(response.status)
    return await response.json();
  } catch (error) {
    console.error("Erro ao cadastrar categoria", error);
  }
}

export async function deleteCategoria(id: number) {
  try {
    await fetch(`${back}/categoria/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("Erro ao deletar Categoria", err);
  }
}

//querys

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}

export function useDeletarProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}

export function useDeletarItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
