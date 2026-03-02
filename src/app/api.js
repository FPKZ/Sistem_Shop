import * as admin from "./api/admin.js";
import * as auth from "./api/auth.js";
import * as clientes from "./api/clientes.tsx";
import * as notas from "./api/notas.js";
import * as produtos from "./api/produtos.tsx";
import * as vendas from "./api/vendas.js";

const back = import.meta.env.VITE_BACKEND_URL;

export async function initServer() {
  try {
    const response = await fetch(`${back}`);
    console.log(response)
    return response;
  } catch (err) {
    console.error("Erro ao se comunicar com o Backend", err);
  }
}
const API = {
  initServer,
  ...admin,
  ...auth,
  ...clientes,
  ...notas,
  ...produtos,
  ...vendas,
};

export default API;
