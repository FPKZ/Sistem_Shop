import { put, del, list } from "./blob.service.js";
import { randomUUID } from "crypto";
import { Conta, Produto } from "../database/models/index.js";
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
/**
 * Deleta uma imagem do Vercel Blob, desde que não esteja vinculada a nenhum produto.
 * Não usa head() antes de del() — o próprio del() já lança erro 404 se a URL não existir,
 * evitando um round-trip de rede desnecessário (economia de ~400–700ms por operação).
 *
 * @param {string} url - URL pública da imagem a ser deletada
 * @returns {Promise<{message: string, url: string}>}
 */
export async function deletarImagem(url) {
    if (!url) throw new Error("A URL da imagem é obrigatória");

    // 1. Verificar se a imagem está vinculada a algum produto no banco
    //    Feito antes do del() para evitar apagar imagens ainda em uso
    const emUso = await Produto.findOne({ 
        where: { 
            img: url 
        },
        attributes: ["id", "img"] // Só precisamos saber se existe, sem buscar dados extras
    });

    if (emUso) {
        await Produto.update({ img: null }, { where: { id: emUso.id } });
    }

    try {
        // 2. Deletar diretamente do Vercel Blob
        //    del() lança um erro com status 404 se a URL não for encontrada
        await del(url);
        return { message: "Imagem deletada com sucesso", url };
    } catch (error) {
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
        // 1. Buscar tudo em paralelo para ganhar performance
          const [produtos, contas] = await Promise.all([
            Produto.findAll({ attributes: ['imgs'], raw: true }),
            Conta.findAll({ attributes: ['img'], raw: true })
        ]);
        // 3. Extrair todas as URLs de forma única
        const urlsEmUso = new Set([
            ...produtos.flatMap(p => p.imgs || []), // Array de imagens do produto
            ...contas.map(c => c.img)               // Imagem de perfil da conta
        ].filter(Boolean));

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