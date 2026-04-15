import { BaseEntity } from "./http";

export interface Cliente extends BaseEntity {
    nome: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    complemento?: string;
    status?: 'Ativo' | 'Inativo';
}

export interface ClientePayload {
    nome: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    complemento?: string;
}
