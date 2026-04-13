import api from "@services/http/client";
import { ApiResponse, Produto, Categoria, Cor, ProdutoFiltros } from "@services/types";

/**
 * Módulo de API para o Catálogo Público.
 * Rotas públicas — não requerem autenticação.
 * Usa o httpClient centralizado para padronizar tratamento de erros e base URL.
 */

/**
 * Busca os produtos do catálogo público com filtros opcionais.
 * @param {ProdutoFiltros} params
 * @returns {Promise<ApiResponse<{ produtos: Produto[]; categorias: Categoria[]; cores: Cor[] }>>}
 */
export async function fetchCatalogo({ item = "", nome = "" }: ProdutoFiltros = {}): Promise<ApiResponse<{ produtos: Produto[]; categorias: Categoria[]; cores: Cor[] }>> {
  try {
    const query = new URLSearchParams({ categoria: item, nome }).toString();
    return await api.get(`/catalogo?${query}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

/**
 * Busca um produto específico pelo ID.
 * @param {{ id: string | number }} params
 * @returns {Promise<ApiResponse<Produto>>}
 */
export async function fetchCatalogoProduto({ id }: { id: string | number }): Promise<ApiResponse<Produto>> {
  try {
    return await api.get(`/catalogo/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

/**
 * Envia um pedido/solicitação de produto pelo catálogo público.
 * @param {object} pedido - Dados do pedido
 * @returns {Promise<any>}
 */
export async function postPedido(pedido: any) {
  try {
    return await api.post("/pedido", pedido);
  } catch (err) { console.error("Erro na API", err); throw err; }
}


