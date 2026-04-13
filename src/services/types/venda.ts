import { BaseEntity } from "./http";
import { Cliente } from "./cliente";
import { ItemEstoque } from "./produto";

export interface ItemVenda extends BaseEntity {
    venda_id: number;
    item_estoque_id: number;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
    Estoque?: ItemEstoque;
}

export interface Venda extends BaseEntity {
    cliente_id?: number | null;
    usuario_id?: number;
    status: 'Andamento' | 'Reservada' | 'Finalizada' | 'Cancelada' | 'Devolvida';
    metodo_pagamento?: string | null;
    desconto?: number;
    valor_total: number;
    cep?: string | null;
    endereco_entrega?: string | null;
    codigo_rastreio?: string | null;
    data_finalizada?: string | null;
    Cliente?: Cliente;
    ItemVendas?: ItemVenda[];
}

export interface VendaPayload {
    cliente_id?: number;
    produtos?: { item_estoque_id: number; quantidade: number }[];
    status?: string;
    [key: string]: any;
}
