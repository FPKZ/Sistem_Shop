import * as admin from "./api/admin";
import * as auth from "./api/auth";
import * as clientes from "./api/clientes";
import * as notas from "./api/notas";
import * as produtos from "./api/produtos";
import * as vendas from "./api/vendas";
import * as dashboard from "./api/dashboard";
import * as catalogo from "./api/catalogo";

const back = import.meta.env.VITE_BACKEND_URL;

export async function initServer() {
  try {
    const response = await fetch(`${back}`);
    // console.log(response)
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
  ...dashboard,
  ...catalogo,
};

export default API;
