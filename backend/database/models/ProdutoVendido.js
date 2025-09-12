import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const ProdutoVendido = sequelize.define('ProdutoVendido', {
    nome: DataTypes.STRING,
    tamanho: DataTypes.STRING,
    cor: DataTypes.STRING,
    img: DataTypes.STRING,
    descricao: DataTypes.STRING,
    valor_venda: DataTypes.FLOAT,
}, {
    tableName: 'ProdutosVendidos'
});

export default ProdutoVendido;
