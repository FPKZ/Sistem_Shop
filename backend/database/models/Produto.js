import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    img: DataTypes.TEXT,
    descricao: DataTypes.TEXT,
}, {
    tableName: 'Produtos'
});

export default Produto;