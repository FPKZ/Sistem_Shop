/**
 * Tipagem base para todas as respostas padronizadas da API usando httpClient.
 * Adaptação do reply.ok() e reply.err() do Backend.
 */
export interface ApiResponse<T = any> {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
    // Em alguns retornos o backend envia o dado diretamente fora de "data" (ex: { ok: true, novacategoria: {...} })
    // O Record garante flexibilidade para propriedades adicionais enquanto unificamos o backend futuramente.
    [key: string]: any; 
}

/** Interface para hooks de formatação genérica se necessários */
export interface BaseEntity {
    id: number;
    createdAt?: string;
    updatedAt?: string;
}
