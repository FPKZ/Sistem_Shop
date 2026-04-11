import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    imgs: DataTypes.ARRAY(DataTypes.TEXT),
    descricao: DataTypes.TEXT,
}, {
    tableName: 'Produtos'
});

export default Produto;