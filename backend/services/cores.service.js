import { Cores } from "../database/models/index.js";
import { Op } from "sequelize";


// Configuração de busca
const config = {
    attributes: ["id", "name", "hex"],
    order: [["name", "ASC"]],
    raw: true, // Força o retorno do Json limpo em vez do Model Tracker completo.
}

export async function getAllCores() {
    return Cores.findAll(config);
}

export function getColor({ id, name, hex }) {
    const queryWhere = {};
    if (id !== undefined) queryWhere.id = id;
    if (name !== undefined) queryWhere.name = name;
    if (hex !== undefined) queryWhere.hex = hex;

    return Cores.findOne({ where: queryWhere, ...config });
}

export function getColorsList(data = []) {
    return Cores.findAll({
        where: {
            hex: { [Op.in]: data }
        }, ...config
    });
}

export async function getColorName(hex) {
    const cor = await Cores.findOne({ where: { hex }, ...config, attributes: ["name"] });
    return cor ? cor.name : hex;
}

export function createColor(color) {
    return Cores.create(color);
}

export function updateColor(id, color) {
    return Cores.update(color, { where: { id } });
}

export function deleteColor(id) {
    return Cores.destroy({ where: { id } });
}

// Busca de cores
export async function getColors(query) {
     // 1) Busca de vários itens (Array)
    // Se enviar ?list=#FFF,#000 ou ?list=#FFF&list=#000
    if (query.list) {
        // Se for passado mais de um "&list=", vira array automático.
        // Se for passado separado por vírgula, damos um split.
        let listaCores = Array.isArray(query.list) 
            ? query.list 
            : query.list.split(',');

        const cores = await getColorsList(listaCores);
        return cores;
    }

    // 2) Busca de um item único
    // Pode ser por id, nome ou hex. Ex: ?hex=#000
    if (query.id || query.name || query.hex) {
        // Enviar 'undefined' em vez de 'null' evita que o Sequelize procure por 'IS NULL' no banco.
        const cor = await getColor({ 
            id: query.id || undefined,
            name: query.name ? (query.name.charAt(0).toUpperCase() + query.name.slice(1)) : undefined,
            hex: query.hex ? query.hex.toUpperCase() : undefined
        });
        return cor;
    }

    // 3) Busca genérica (se não passar nada)
    // Retorna todas as cores ordenadas por nome
    return getAllCores();
}