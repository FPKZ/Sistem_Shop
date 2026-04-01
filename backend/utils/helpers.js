/**
 * Verifica se um valor é nulo, undefined ou string vazia.
 * @param {any} value
 * @returns {boolean}
 */
export function isNullOrUndefined(value) {
  return value === null || value === undefined || value === "";
}

/**
 * Calcula o número de dias entre duas datas.
 * @param {Date} data
 * @param {Date} referencia
 * @returns {number}
 */
export function diasAte(data, referencia = new Date()) {
  return Math.ceil((new Date(data) - referencia) / (1000 * 60 * 60 * 24));
}

/**
 * Formata uma data para string ISO (apenas a parte da data).
 * @param {Date|string} date
 * @returns {string}
 */
export function toISODate(date) {
  return new Date(date).toISOString().split("T")[0];
}
