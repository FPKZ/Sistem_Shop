import { put, del, list, head } from "./blob.service.js";
import { randomUUID } from "crypto";
import { Produto } from "../database/models/index.js";
import { Op } from "sequelize";
import { env } from "../config/env.js";


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
    if (!url) throw new Error("A URL da imagem é obrigatória");

    // 1. Verificar se a imagem está em uso no banco de dados
    const emUso = await Produto.findOne({ where: { img: url } });
    if (emUso) {
        throw new Error("Não é possível deletar esta imagem pois ela está vinculada a um produto");
    }

    try {
        // 2. Verificar se a imagem existe no Vercel Blob usando head()
        const blob = await head(url);
        
        if (!blob) throw new Error("Imagem não encontrada no servidor de arquivos");

        // 3. Deletar do Vercel Blob
        await del(url);
        
        return { message: "Imagem deletada com sucesso", url };
    } catch (error) {
        // Se for um erro 404 do head(), tratamos como imagem não encontrada
        if (error.status === 404 || error.message?.includes("404")) {
            throw new Error("Imagem não encontrada no servidor de arquivos (Vercel Blob)");
        }
        throw error;
    }
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

/**
 * Limpa imagens do Vercel Blob que não estão vinculadas a nenhum produto no banco de dados.
 * Designada para rodar como tarefa agendada.
 */
export async function limparImagensOrfas() {
    try {
        console.log("[CLEANUP] Iniciando limpeza de imagens órfãs...");
        
        // 1. Listar todos os blobs existentes
        const blobs = await listarImgs();
        if (blobs.length === 0) return console.log("[CLEANUP] Nenhum blob encontrado.");

        // 2. Buscar todas as URLs de imagens em uso no banco
        const produtosComImg = await Produto.findAll({
            attributes: ['img'],
            where: {
                img: { [Op.ne]: null } // Garantir que não pegamos nulos
            },
            raw: true
        });
        
        // Atualmente o Sequelize pode usar Op.ne ou strings dependendo da config, 
        // mas vamos extrair as URLs de forma segura.
        const urlsEmUso = new Set(produtosComImg.map(p => p.img).filter(Boolean));

        console.log(`[CLEANUP] Validando ${blobs.length} blobs contra ${urlsEmUso.size} imagens em uso.`);

        // 3. Identificar órfãos
        const orfas = blobs.filter(blob => !urlsEmUso.has(blob.url) && blob.pathname !== "app-cache.json");

        if (orfas.length === 0) {
            console.log("[CLEANUP] Nenhuma imagem órfã encontrada.");
            return;
        }

        console.log(`[CLEANUP] Deletando ${orfas.length} imagens órfãs...`);

        // 4. Deletar órfãos (em paralelo para ser mais rápido)
        const deletePromises = orfas.map(img => {
            console.log(`[CLEANUP] Deletando órfã: ${img.url}`);
            return del(img.url).catch(err => console.error(`[CLEANUP] Erro ao deletar ${img.url}:`, err.message));
        });

        await Promise.all(deletePromises);
        console.log("[CLEANUP] Limpeza concluída com sucesso.");
        
    } catch (error) {
        console.error("[CLEANUP] Erro durante a limpeza de blobs:", error.message);
    }
}