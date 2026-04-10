import { put, del, list } from "@vercel/blob";
import { randomUUID } from "crypto";


export async function listarImgs() {
    const { blobs } = await list()
    return blobs
}

/**
 * Faz upload de uma imagem para o Vercel Blob e retorna a URL pública.
 * @param {{ buffer: Buffer, filename: string } | null} imgFile
 * @returns {Promise<string|null>}
 */
async function uploadImagem(imgFile) {
  if (!imgFile?.buffer) return null;
  const nomeUnico = `${randomUUID()}-${imgFile.filename}`;
  const blob = await put(nomeUnico, imgFile.buffer, { access: "public" });
  return blob.url;
}

/**
 * 
 * @param {string} url - URL da imagem a ser deletada
 */
export async function deletarImagem(url) {
    await del(url)
}

/**
 * Salva múltiplas imagens e retorna um array com as URLs públicas.
 * @param {Array|Object|null} imgs - Um array de arquivos ou um arquivo único.
 * @returns {Promise<string[]>} - Array contendo as URLs das imagens enviadas.
 */
export async function salvarImagems(imgs) {
    // 1. Garantir que 'imgs' seja sempre um array, tratando valores nulos/undefined
    const listaDeArquivos = Array.isArray(imgs) ? imgs : (imgs ? [imgs] : []);

    // 2. Criar um array de Promises chamando uploadImagem para cada item
    // Usamos .filter(Boolean) para ignorar itens vazios/nulos no array original
    const uploadPromises = listaDeArquivos
        .filter(img => img && img.buffer)
        .map(img => uploadImagem(img));

    // 3. Aguardar que todos os uploads sejam concluídos
    // Promise.all retorna um array com os resultados (as URLs)
    const urls = await Promise.all(uploadPromises);

    // 4. Retorna apenas as URLs que não são nulas
    // return urls.filter(url => url !== null);
    return urls
}