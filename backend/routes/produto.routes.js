import {
  Produto,
  Nota,
  Categoria,
  ItemEstoque,
  Cliente,
  ItemVendido,
  ItemReservado,
} from "../database/models/index.js";
import { Op } from "sequelize";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import "dotenv/config";
//const pump = util.promisify(pipeline)

export default async function produtoRoutes(fastify) {
  fastify.get("/produtos", async (request, reply) => {
    const query = request.query;
    //console.log(query)

    if (query.itens === "all") {
      console.log("all");
      const produtos = await ItemEstoque.findAll({
        include: [
          { model: Nota, as: "nota" },
          {
            model: Produto,
            as: "produto",
            include: [{ model: Categoria, as: "categoria" }],
          },
        ],
      });

      return reply.code(200).send(produtos);
    } else if (query.itens === "vendidos") {
      console.log("vendidos");
      const produtos = await ItemEstoque.findAll({
        where: { status: "Vendido" },
        include: [
          { model: Nota, as: "nota" },
          {
            model: Produto,
            as: "produto",
            include: [{ model: Categoria, as: "categoria" }],
          },
        ],
      });
      // console.log(produtos)
      return reply.code(200).send(produtos);
    } else if (query.itens === "estoque") {
      console.log("estoque");
      // const produtos = await ItemEstoque.findAll({
      //   where: {status: "Disponivel"},
      //   include: [
      //     {model: Nota, as: "nota"},
      //     {model: Produto, as: "produto",
      //       include: [
      //         {model: Categoria, as: "categoria"}
      //       ]
      //     }
      //   ]
      // })
      const produtos = await Produto.findAll({
        include: [
          { model: Categoria, as: "categoria" },
          {
            model: ItemEstoque,
            as: "itemEstoque",
            where: { status: "Disponivel" },
            include: [{ model: Nota, as: "nota" }],
          },
        ],
      });
      // console.log(produtos)
      return reply.code(200).send(produtos);
    } else if (query.itens === "reservado") {
      console.log("reservado");
      const produtos = await ItemEstoque.findAll({
        where: { status: "Reservado" },
        include: [
          { model: Nota, as: "nota" },
          {
            model: Produto,
            as: "produto",
            include: [{ model: Categoria, as: "categoria" }],
          },
        ],
      });
      // console.log(produtos)
      return reply.code(200).send(produtos);
    } else if (query.nome && query.nome !== " ") {
      console.log(query.nome);
      const produtos = await Produto.findAll({
        where: { nome: { [Op.like]: "%" + query.nome + "%" } },
        include: [
          { model: Categoria, as: "categoria" },
          {
            model: ItemEstoque,
            as: "itemEstoque",
            include: [{ model: Nota, as: "nota" }],
          },
        ],
      });

      return reply.code(200).send(produtos);
    }

    const produtos = await Produto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        {
          model: ItemEstoque,
          as: "itemEstoque",
          include: [{ model: Nota, as: "nota" }],
        },
      ],
    });

    return reply.send(produtos);
  });

  fastify.post("/produto", async (request, reply) => {
    let body = {};
    let imgFile = null;

    console.log(request.body);

    if (request.isMultipart()) {
      const data = await request.parts();
      for await (const part of data) {
        if (part.type === "file") {
          const buffer = await toBuffer(part.file);
          imgFile = { buffer: buffer, filename: part.filename };
          console.log(`Arquivo processado: ${part.filename}`);
        } else {
          body[part.fieldname] = part.value;
        }
      }
    } else {
      body = request.body;
    }

    // Normaliza itens: pode vir como string (multipart) ou como objeto (JSON)
    if (body.itens && typeof body.itens === "string") {
      body.itens = JSON.parse(body.itens);
    }

    if (!body.nome) {
      return reply.err('O campo "nome" é obrigatório');
    }

    const result = await CadastroProduto(body, imgFile);

    return reply.code(201).ok(result, "Estoque atualizado com sucesso!");
  });

  fastify.put("/produto/reservar/:id", async (request, reply) => {
    const produtoId = request.params.id;
    const clienteId = request.query.cliente_id;
    const cliente = await Cliente.findByPk(clienteId);
    const produto = await ItemEstoque.findByPk(produtoId);

    if (!produto) return reply.err("Produto não encontrado", 404);
    if (!cliente) return reply.err("Cliente não encontrado", 404);

    await ItemReservado.create({
      cliente_id: clienteId,
      itemEstoque_id: produtoId,
      data: new Date(),
    });

    await produto.update({ status: "Reservado" });

    return reply.ok({ produto }, "Produto reservado com sucesso");
  });

  fastify.put("/produto/remover/:id", async (request, reply) => {
    const itemId = request.params.id;
    const data = request.body;

    const item = await ItemEstoque.findByPk(itemId);
    const itemReservado = await ItemReservado.findOne({
      where: { itemEstoque_id: itemId },
    });

    if (!item) return reply.err("Item não encontrado", 404);
    if (!itemReservado) return reply.err("Item reservado não encontrado", 404);

    await itemReservado.destroy();
    await item.update(data);

    return reply.ok({ item }, "Item atualizado com sucesso");
  });

  fastify.put("/produto/item/:id", async (request, reply) => {
    const itemId = request.params.id;
    const data = request.body;

    const item = await ItemEstoque.findByPk(itemId);
    if (!item) return reply.err("Item não encontrado", 404);

    await item.update(data);
    return reply.ok({ item }, "Item atualizado com sucesso");
  });

  fastify.put("/produto/:id", async (request, reply) => {
    const produtoId = request.params.id;
    const data = request.body;

    const produto = await Produto.findByPk(produtoId);
    if (!produto) return reply.err("Produto não encontrado", 404);

    await produto.update(data);
    return reply.ok({ produto }, "Produto atualizado com sucesso");
  });

  fastify.delete("/produto/:id", async (request, reply) => {
    const produtoId = request.params.id;

    const produto = await Produto.findByPk(produtoId);

    if (!produto) return reply.err("Produto não encontrado", 404);

    await produto.destroy();
    return reply.status(204).ok({}, "Produto deletado com sucesso");
  });

  fastify.delete("/produto/item/:id", async (request, reply) => {
    const itemId = request.params.id;

    const item = await ItemEstoque.findByPk(itemId);
    if (!item) return reply.err("Item não encontrado", 404);

    await item.destroy();
    return reply.status(204).ok({}, "Item deletado com sucesso");
  });
}

export async function CadastroProduto(produtoData, imgFile) {
  let imgPath = null;
  if (imgFile && imgFile.buffer) {
    const nomeUnico = `${randomUUID()}-${imgFile.filename}`;
    const blob = await put(nomeUnico, imgFile.buffer, {
      access: "public",
    });
    imgPath = blob.url; // Salvamos a URL completa retornada pelo Vercel Blob
  }

  const { nome, descricao, categoria_id, itens } = produtoData;

  if (!nome) {
    throw new Error('O campo "nome" é obrigatório no CadastroProduto');
  }

  let produto = await Produto.findOne({ where: { nome: nome } });

  if (!produto) {
    produto = await Produto.create({
      nome,
      descricao,
      categoria_id,
      itens,
      img: imgPath,
    });
  }

  let itensCriados = [];
  if (itens && itens.length > 0) {
    const novosItens = itens.map((item) => ({
      nome,
      nota_id: item.nota_id,
      tamanho: item.tamanho,
      cor: item.cor,
      marca: item.marca,
      codigo_barras: item.codigo_barras,
      valor_compra: item.valor_compra,
      valor_venda: item.valor_venda,
      lucro: item.lucro,
      produto_id: produto.id,
      status: "Disponivel",
    }));
    itensCriados = await ItemEstoque.bulkCreate(novosItens, {
      returning: true,
    });
  }

  return { produto, itensEstoque: itensCriados };
}

export async function toBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
