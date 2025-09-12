import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    img: DataTypes.STRING,
    descricao: DataTypes.STRING,
}, {
    tableName: 'Produtos'
});

export default Produto;