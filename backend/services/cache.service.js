import { put } from "./blob.service.js";
import { Produto, Categoria, Nota, ItemEstoque } from "../database/models/index.js";
import { listarCatalogo } from "./catalogo.service.js";
import { getColors } from "./cores.service.js";

const INCLUDE_ITEM_ESTOQUE_COMPLETO = [
  { model: Categoria, as: "categoria" },
  { model: ItemEstoque, as: "itemEstoque", include: [{ model: Nota, as: "nota" }] },
];

/**
 * Coleta todos os dados essenciais servidos pelas rotas públicas e administrativas
 * e gera um único JSON agrupado que é salvo no Vercel Blob.
 * 
 * @param {object} logger Instância de log opcional
 */
export async function syncCacheToBlob(logger = console) {
  try {
    const [catalogo, categorias, notas, produtos, cores] = await Promise.all([
      listarCatalogo({}),
      Categoria.findAll({ attributes: ["id", "nome", "descricao"], order: [["nome", "ASC"]] }),
      Nota.findAll({ include: [{ model: ItemEstoque, as: "itensNota" }] }),
      Produto.findAll({ include: INCLUDE_ITEM_ESTOQUE_COMPLETO }),
      getColors({})
    ]);

    const payload = {
      catalogo: { ok: true, message: "Operação realizada com sucesso", data: catalogo },
      categorias: { ok: true, message: "Operação realizada com sucesso", data: categorias },
      notas: notas,
      produtos: produtos,
      cores: { ok: true, message: "Operação realizada com sucesso", data: cores }
    };

    const blob = await put('app-cache.json', JSON.stringify(payload), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json'
    });

    logger.info(`[CACHE] Vercel Blob cache generated successfully. Payload size: ${JSON.stringify(payload).length} bytes`);
    logger.info(`[CACHE] URL: ${blob.url}`);
    return blob.url;
  } catch (error) {
    logger.error("[CACHE] CRITICAL ERROR syncing cache: " + error.message);
    if (error.stack) logger.error(error.stack);
  }
}
