import produtoRoutes from "./produto.routes.js";
import categoriaRoutes from "./Categoria.routes.js";
import clienteRoutes from "./cliente.routes.js";
import notaRoutes from "./nota.routes.js";
import vendaRoutes from "./venda.routes.js";
import notaVendaRoutes from "./notaVenda.routes.js";
import contaRoutes from "./Conta.routes.js";
import dashboardRoutes from "./Dashboard.routes.js";
import catalogoRoutes from "./Catalogo.routes.js";
import coresRoutes from "./Cores.routes.js";
import ImagensRoute from "./Imagens.routes.js";

// eslint-disable-next-line no-unused-vars
export default async function RegistarRotas(server, options){
    await server.register(produtoRoutes);
    await server.register(categoriaRoutes);
    await server.register(clienteRoutes);
    await server.register(notaRoutes);
    await server.register(vendaRoutes);
    await server.register(notaVendaRoutes);
    await server.register(contaRoutes);
    await server.register(dashboardRoutes);
    await server.register(catalogoRoutes);
    await server.register(coresRoutes);
    await server.register(ImagensRoute)
}