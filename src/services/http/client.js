/**
 * httpClient — Wrapper centralizado do fetch com suporte a JWT automático.
 *
 * - Injeta o header Authorization: Bearer <token> em todas as requisições
 * - Intercepta respostas 401 e dispara um evento para forçar logout automático
 * - Mantém a mesma API do fetch nativo via `httpClient(path, options)`
 * - Atalhos convenientes via `api.get()`, `api.post()`, etc.
 */

const back = import.meta.env.VITE_BACKEND_URL;

function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Realiza uma requisição autenticada ao backend.
 * @param {string} path - Caminho relativo (ex: "/produtos")
 * @param {RequestInit} options - Opções nativas do fetch
 * @returns {Promise<Response>}
 */
async function httpClient(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${back}${path}`, { ...options, headers });
  } catch {
    // Erro de rede (ECONNREFUSED, servidor offline, timeout de DNS, etc.)
    // Dispara evento global para que o AuthContext exiba o loading e inicie o retry
    window.dispatchEvent(new CustomEvent("server:offline"));
    throw new Error("Servidor indisponível. Tentando reconectar...");
  }

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent("auth:401"));
  }

  return response;
}

/**
 * Faz a requisição e retorna o JSON já parseado.
 * Se a resposta tiver o formato { ok, message, ...data }, extrai automaticamente os dados.
 * Caso contrário (array ou objeto simples), retorna diretamente.
 *
 * @param {string} path
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const response = await httpClient(path, options);

  if (response.status === 204) return { ok: true };

  const json = await response.json();

  // Caso seja o padrão reply.ok() do backend
  if (json && typeof json === "object" && !Array.isArray(json) && "ok" in json) {
    if (!json.ok) {
      const err = new Error(json.message || json.error || "Erro na requisição");
      err.statusCode = response.status;
      err.data = json;
      throw err;
    }
    // O backend já mandou o 'ok: true'. Preservamos o envelope original
    // para não quebrar componentes do frontend que dependem da resposta integral.
    return json;
  }

  // Caso contrário (como nas rotas GET refatoradas que devolvem os dados puros),
  // adicionamos 'ok: true' invisivelmente para os "ifs" de legacy verification (.ok)
  if (json && typeof json === "object") {
    Object.defineProperty(json, 'ok', {
      value: true,
      enumerable: false,
      writable: true,
    });
  }

  return json;
}

/**
 * Atalhos convenientes para os métodos HTTP.
 */
export const api = {
  get:    (path, opts = {}) => request(path, { method: "GET",    ...opts }),
  post:   (path, body, opts = {}) => request(path, { method: "POST",   body: body instanceof FormData ? body : JSON.stringify(body), ...opts }),
  put:    (path, body, opts = {}) => request(path, { method: "PUT",    body: body instanceof FormData ? body : JSON.stringify(body), ...opts }),
  delete: (path, body, opts = {}) => request(path, { method: "DELETE", body: body instanceof FormData ? body : JSON.stringify(body), ...opts }),
  /**
   * Versão raw que retorna o Response original (sem parsear).
   * Útil quando o chamador precisa verificar status manualmente.
   */
  raw: httpClient,
};

export { httpClient };
export default api;
