import Produto from "./Produto.js";
import Categoria from "./Categoria.js";
import Nota from "./Nota.js";

Produto.belongsTo(Categoria, { foreignKey: 'categoria_Id', as: 'categoria' });

Categoria.hasMany(Produto, { foreignKey: 'categoria_Id', as: 'produtos' });

Produto.belongsTo(Nota, { foreignKey: 'nota_id', as: 'Nota' });

Nota.hasMany(Produto, { foreignKey: 'nota_id', as: 'produtos' });

export { Produto, Categoria, Nota };