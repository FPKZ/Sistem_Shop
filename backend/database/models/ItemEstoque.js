import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const ItemEstoque = sequelize.define("ItemEstoque", {
    nome: DataTypes.STRING,
    tamanho: DataTypes.STRING,
    cor: DataTypes.STRING,
    marca: DataTypes.STRING,
    codigo_barras: DataTypes.STRING,
    valor_compra: DataTypes.FLOAT,
    valor_venda: DataTypes.FLOAT,
    lucro: DataTypes.FLOAT,
    status: DataTypes.STRING,
},{
    tableName: "ItemEstoque"
})

export default ItemEstoque;