import {
  Venda,
  ItemVendido,
  ItemEstoque,
  ItemReservado,
  NotaVenda,
  Cliente,
} from "../database/models/index.js";
import { Op } from "sequelize";

/**
 * Determina o status final de uma venda com base nas formas de pagamento.
 * Se todas as notas são Promissórias, a venda fica pendente.
 * @param {Array<{ forma_pagamento: string }>} notasVenda
 * @returns {"pendente"|"concluida"}
 */
function calcularStatusVenda(notasVenda) {
  return notasVenda.every((n) => n.forma_pagamento === "Promissória")
    ? "pendente"
    : "concluida";
}

/**
 * Verifica e expira reservas cujo prazo já passou.
 * Remove os ItemReservado, devolve itens ao estoque e marca a venda como cancelada.
 * @returns {Promise<number>} Quantidade de reservas expiradas
 */
export async function expirarReservas() {
  const agora = new Date();
  const reservasExpiradas = await Venda.findAll({
    where: { status: "pendente", prazo_reserva: { [Op.lt]: agora } },
    include: [{ model: ItemVendido, as: "itensVendidos" }],
  });

  if (reservasExpiradas.length === 0) return 0;

  for (const reserva of reservasExpiradas) {
    const itensIds = reserva.itensVendidos.map((item) => item.itemEstoque_id);

    await ItemEstoque.update({ status: "Disponivel" }, { where: { id: itensIds } });
    await ItemReservado.destroy({ where: { itemEstoque_id: itensIds } });
    await reserva.update({ status: "cancelada" });
  }

  return reservasExpiradas.length;
}

/**
 * Cria uma nova venda (concluída ou reserva).
 * Orquestra validações, atualização de status dos itens, reservas e criação da venda.
 *
 * @param {object} data - Dados da venda vindos do request.body
 * @returns {Promise<Venda>}
 * @throws {Error} com campos `statusCode` e `message` para erros esperados
 */
export async function criarVenda(data, vendedor_id) {
  const { itensVendidos, reservar, cliente_id, notaVenda } = data;

  if (!itensVendidos?.length) {
    const err = new Error("A venda deve conter ao menos um item vendido");
    err.statusCode = 400;
    throw err;
  }

  const itensEstoqueIds = itensVendidos.map((i) => i.itemEstoque_id);

  const itensEstoque = await ItemEstoque.findAll({ where: { id: itensEstoqueIds } });
  if (itensEstoque.length !== itensEstoqueIds.length) {
    const err = new Error("Um ou mais itens do estoque não foram encontrados");
    err.statusCode = 400;
    throw err;
  }

  const cliente = await Cliente.findByPk(cliente_id);
  if (!cliente) {
    const err = new Error("Cliente não encontrado");
    err.statusCode = 404;
    throw err;
  }

  const itensReservadosOutroCliente = await ItemReservado.findAll({
    where: { itemEstoque_id: itensEstoqueIds, cliente_id: { [Op.ne]: cliente_id } },
  });
  if (itensReservadosOutroCliente.length > 0) {
    const err = new Error("Um ou mais itens estão reservados para outro cliente");
    err.statusCode = 400;
    throw err;
  }

  if (!reservar && (!notaVenda || notaVenda.length === 0)) {
    const err = new Error("A venda deve conter ao menos uma nota de pagamento");
    err.statusCode = 400;
    throw err;
  }

  // Atualiza status dos itens
  const novoStatus = reservar ? "Reservado" : "Vendido";
  await Promise.all(itensEstoque.map((item) => { item.status = novoStatus; return item.save(); }));

  if (reservar) {
    await Promise.all(
      itensEstoqueIds.map((itemId) =>
        ItemReservado.create({ cliente_id, itemEstoque_id: itemId, data: new Date() })
      )
    );
    data.status = "pendente";
  } else {
    await ItemReservado.destroy({ where: { itemEstoque_id: itensEstoqueIds } });
    data.status = calcularStatusVenda(notaVenda);
  }
  
  data.vendedor_id = vendedor_id;

  const novaVenda = await Venda.create(data, {
    include: [
      { model: ItemVendido, as: "itensVendidos" },
      { model: NotaVenda, as: "notaVenda" },
    ],
  });

  return novaVenda;
}

/**
 * Finaliza uma venda em estado de reserva (pendente).
 * Atualiza itens para Vendido, remove reservas, adiciona notas de pagamento e atualiza a venda.
 *
 * @param {string|number} id - ID da venda
 * @param {object} data - { notaVenda, desconto, valor_total }
 * @returns {Promise<void>}
 */
export async function finalizarVenda(id, data, vendedor) {
  const venda = await Venda.findByPk(id, {
    include: [{ model: ItemVendido, as: "itensVendidos" }],
  });

  if(venda.vendedor_id !== vendedor.id && vendedor.cargo !== "admin"){
    const err = new Error("Você não tem permissão para finalizar esta venda");
    err.statusCode = 403;
    throw err;
  }

  if (!venda) {
    const err = new Error("Venda não encontrada");
    err.statusCode = 404;
    throw err;
  }

  const itensIds = venda.itensVendidos.map((i) => i.itemEstoque_id);

  await ItemEstoque.update({ status: "Vendido" }, { where: { id: itensIds } });
  await ItemReservado.destroy({ where: { itemEstoque_id: itensIds } });

  const statusFinal = calcularStatusVenda(data.notaVenda);

  await venda.update({
    status: statusFinal,
    desconto: data.desconto,
    valor_total: data.valor_total,
    prazo_reserva: null,
  });

  if (data.notaVenda?.length > 0) {
    await Promise.all(
      data.notaVenda.map((n) => NotaVenda.create({ ...n, venda_id: id }))
    );
  }
}

/**
 * Estorna uma venda, devolvendo os itens ao estoque.
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function estornarVenda(id, user) {
  const venda = await Venda.findByPk(id, {
    include: [{ model: ItemVendido, as: "itensVendidos" }],
  });

  if(venda.vendedor_id !== user.id && user.cargo !== "admin"){
    const err = new Error("Você não tem permissão para estornar esta venda");
    err.statusCode = 403;
    throw err;
  }

  if (!venda) {
    const err = new Error("Venda não encontrada");
    err.statusCode = 404;
    throw err;
  }

  if (venda.status === "estorno") {
    const err = new Error("Venda já está estornada");
    err.statusCode = 400;
    throw err;
  }

  const itensIds = venda.itensVendidos.map((i) => i.itemEstoque_id);
  await ItemEstoque.update({ status: "Disponivel" }, { where: { id: itensIds } });
  await venda.update({ status: "estorno" });
}

/**
 * Realiza devolução parcial de itens de uma venda.
 * @param {string|number} id
 * @param {{ itensDevolverIds: number[], valorDevolvido: number }} data
 * @returns {Promise<Venda>}
 */
export async function devolverItens(id, { itensDevolverIds, valorDevolvido }, user) {
  if (!itensDevolverIds?.length) {
    const err = new Error("É necessário informar os itens para devolução");
    err.statusCode = 400;
    throw err;
  }

  const venda = await Venda.findByPk(id);
  if (!venda) {
    const err = new Error("Venda não encontrada");
    err.statusCode = 404;
    throw err;
  }

  if(venda.vendedor_id !== user.id && user.cargo !== "admin"){
    const err = new Error("Você não tem permissão para devolver itens desta venda");
    err.statusCode = 403;
    throw err;
  }

  await ItemEstoque.update({ status: "Disponivel" }, { where: { id: itensDevolverIds } });
  await ItemVendido.destroy({ where: { venda_id: id, itemEstoque_id: itensDevolverIds } });

  const novoTotal = Number(venda.valor_total) - Number(valorDevolvido);
  await venda.update({ valor_total: novoTotal });

  return venda;
}
