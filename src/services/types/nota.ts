import { BaseEntity } from "./http";

export interface NotaFiscal extends BaseEntity {
    codigo: string;
    fornecedor?: string | null;
    data_emissao?: string | null;
    valor_total?: number;
    status?: string;
}

export interface NotaFiscalPayload {
    codigo: string;
    fornecedor?: string;
    data_emissao?: string;
    valor_total?: number;
}
