import Produto from "./Produto.js";
import Categoria from "./Categoria.js";
import Nota from "./Nota.js";
import ItemEstoque from "./ItemEstoque.js";
import ItemVendido from "./ItemVendido.js";
import Venda from "./Venda.js";
import Cliente from "./Cliente.js"
import NotaVenda from "./NotaVenda.js"

Produto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Categoria.hasMany(Produto, { foreignKey: 'categoria_id', as: 'produtos' });

ItemEstoque.belongsTo(Produto, { foreignKey: "produto_id", as: "produtos"})
Produto.hasMany(ItemEstoque, { foreignKey: "produto_id", as: "itemEstoque"})

ItemEstoque.belongsTo(Nota, { foreignKey: "nota_id", as: "nota"})
Nota.hasMany(ItemEstoque, { foreignKey: "nota_id", as: "itensNota"})

Venda.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente"})
Cliente.hasMany(Venda, { foreignKey: "cliente_id", as: "vendas"})

Venda.hasMany(ItemVendido, { foreignKey: "venda_id", as: "itensVendidos"})
ItemVendido.belongsTo(Venda, { foreignKey: "venda_id", as: "venda"})

ItemEstoque.hasOne(ItemVendido, { foreignKey: "itemEstoque_id", as: "detalheVenda"})
ItemVendido.belongsTo(ItemEstoque, { foreignKey: "itemEstoque_id", as: "itemEstoque"})

Venda.hasMany(NotaVenda, { foreignKey: "venda_id", as: "pagamento"})
NotaVenda.belongsTo(Venda, {foreignKey: "venda_id", as: "venda"})

export {
    Produto,
    Categoria,
    Nota,
    ItemEstoque,
    ItemVendido,
    Cliente,
    NotaVenda,
    Venda
};