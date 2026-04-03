import { Nota } from "../database/models/index.js";

/**
 * Verifica as notas e atualiza o status de "pendente" para "vencido"
 * quando a data de vencimento já passou.
 *
 * @param {Array<Nota>} notas
 * @returns {Promise<void>}
 */
export async function verificarVencimentos(notas) {
  const agora = new Date();
  const atualizacoes = notas
    .filter((nota) => nota.status === "pendente" && new Date(nota.data_vencimento) < agora)
    .map((nota) => {
      nota.status = "vencido";
      return nota.update({ status: "vencido" });
    });

  await Promise.all(atualizacoes);
}
