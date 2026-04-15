import { Produto, ItemEstoque } from "../database/models/index.js";
import { deletarImagem } from "./img.service.js";

/**
 * Cadastra ou atualiza um produto e seus itens de estoque.
 * Cria o produto se não existir (busca por nome), e sempre adiciona novos itens de estoque.
 *
 * @param {object} produtoData - Dados do produto (nome, descricao, categoria_id, itens[])
 * @returns {Promise<{ produto: Produto, itensEstoque: ItemEstoque[] }>}
 */
export async function cadastrarProduto(produtoData) {
  try{
    const { nome, descricao, categoria_id, imgs, itens } = produtoData;
  
    if (!nome) throw new Error('O campo "nome" é obrigatório');
    if (!descricao) throw new Error('O campo "descricao" é obrigatório');
    if (!categoria_id) throw new Error('O campo "categoria_id" é obrigatório');
  
    let produto = await Produto.findOne({ where: { nome } });
  
    if (!produto) {
      produto = await Produto.create({ nome, descricao, categoria_id, img: imgs[0], imgs });
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
  }catch(err){
    if(produtoData.imgs.length > 0) {
      for(const img of produtoData.imgs) {
        await deletarImagem(img)
      }
    }
    throw err
  }
}