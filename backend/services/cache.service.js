import { put } from "./blob.service.js";
import { Categoria } from "../database/models/index.js";
import { listarCatalogo } from "./catalogo.service.js";
import { getColors } from "./cores.service.js";

/**
 * Coleta os dados públicos do catálogo e gera um JSON salvo no Vercel Blob.
 * Somente dados consumidos sem login são incluídos:
 *   - catálogo: produtos visiveis publicamente
 *   - categorias: usadas nos filtros do catálogo
 *   - cores: usadas nos filtros do catálogo
 *
 * Notas e Produtos (dados administrativos) são excluídos pois só são
 * acessados por usuários logados — o backend já está acordado nesse cenário.
 *
 * @param {object} logger Instância de log opcional
 */
export async function syncCacheToBlob(logger = console) {
  try {
    // Apenas 3 queries leves — sem dados administrativos
    const [catalogo, categorias, cores] = await Promise.all([
      listarCatalogo({}),
      Categoria.findAll({ attributes: ["id", "nome", "descricao"], order: [["nome", "ASC"]] }),
      getColors({})
    ]);

    const payload = {
      catalogo:   { ok: true, message: "Operação realizada com sucesso", data: catalogo },
      categorias: { ok: true, message: "Operação realizada com sucesso", data: categorias },
      cores:      { ok: true, message: "Operação realizada com sucesso", data: cores },
    };

    const blob = await put('app-cache.json', JSON.stringify(payload), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json'
    });

    logger.info(`[CACHE] Cache público gerado com sucesso. Tamanho: ${JSON.stringify(payload).length} bytes`);
    logger.info(`[CACHE] URL: ${blob.url}`);
    return blob.url;
  } catch (error) {
    logger.error("[CACHE] ERRO CRÍTICO ao sincronizar cache: " + error.message);
    if (error.stack) logger.error(error.stack);
  }
}
