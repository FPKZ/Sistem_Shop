import {
  Produto,
  ItemEstoque,
  Categoria,
  Nota
} from "../database/models/index.js";
import { Op } from "sequelize";
import { deletarImagem } from "./img.service.js";


const INCLUDE_PRODUTO_COM_CATEGORIA = [
  { model: Categoria, as: "categoria" },
];

const INCLUDE_ITEM_ESTOQUE_COMPLETO = [
  { model: Categoria, as: "categoria" },
  { model: ItemEstoque, as: "itemEstoque", include: [{ model: Nota, as: "nota" }] },
];

const INCLUDE_ITEM_COM_PRODUTO = [
  { model: Nota, as: "nota" },
  { model: Produto, as: "produto", include: [{ model: Categoria, as: "categoria" }] },
];

/**
 * Buscar produtos
 */
export async function buscarProdutos(query) {
  const { itens, nome, id } = query;

    if (id) {
      const produto = await Produto.findByPk(id, { include: INCLUDE_ITEM_ESTOQUE_COMPLETO });
      return produto;
    }

    if (itens === "all") {
      const produtos = await ItemEstoque.findAll({ include: INCLUDE_ITEM_COM_PRODUTO });
      return produtos;
    }

    if (itens === "vendidos") {
      const produtos = await ItemEstoque.findAll({ where: { status: "Vendido" }, include: INCLUDE_ITEM_COM_PRODUTO });
      return produtos;
    }

    if (itens === "estoque") {
      const produtos = await Produto.findAll({
        include: [
          ...INCLUDE_PRODUTO_COM_CATEGORIA,
          { model: ItemEstoque, as: "itemEstoque", where: { status: "Disponivel" } },
        ],
      });
      return produtos;
    }

    if (itens === "reservado") {
      const produtos = await ItemEstoque.findAll({ where: { status: "Reservado" }, include: INCLUDE_ITEM_COM_PRODUTO });
      return produtos;
    }

    if (itens === "none") {
      const produtos = await Produto.findAll({ include : INCLUDE_PRODUTO_COM_CATEGORIA});
      console.log(produtos)
      return produtos
    }

    const where = nome && nome !== " " ? { nome: { [Op.like]: `%${nome}%` } } : {};
    const produtos = await Produto.findAll({ where, include: INCLUDE_ITEM_ESTOQUE_COMPLETO });
    return produtos
}


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