import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { Produto, ItemEstoque } from "../database/models/index.js";
import { toBuffer } from "../utils/stream.js";

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
 * Cadastra ou atualiza um produto e seus itens de estoque.
 * Cria o produto se não existir (busca por nome), e sempre adiciona novos itens de estoque.
 *
 * @param {object} produtoData - Dados do produto (nome, descricao, categoria_id, itens[])
 * @param {{ buffer: Buffer, filename: string } | null} imgFile - Arquivo de imagem (opcional)
 * @returns {Promise<{ produto: Produto, itensEstoque: ItemEstoque[] }>}
 */
export async function cadastrarProduto(produtoData, imgFile) {
  const { nome, descricao, categoria_id, itens } = produtoData;

  if (!nome) throw new Error('O campo "nome" é obrigatório');

  const imgPath = await uploadImagem(imgFile);

  let produto = await Produto.findOne({ where: { nome } });

  if (!produto) {
    produto = await Produto.create({ nome, descricao, categoria_id, img: imgPath });
  }

  let itensCriados = [];
  if (itens?.length > 0) {
    const novosItens = itens.map((item) => ({
      nome,
      nota_id:        item.nota_id,
      tamanho:        item.tamanho,
      cor:            item.cor,
      marca:          item.marca,
      codigo_barras:  item.codigo_barras,
      valor_compra:   item.valor_compra,
      valor_venda:    item.valor_venda,
      lucro:          item.lucro,
      produto_id:     produto.id,
      status:         "Disponivel",
    }));
    itensCriados = await ItemEstoque.bulkCreate(novosItens, { returning: true });
  }

  return { produto, itensEstoque: itensCriados };
}

export { toBuffer };
