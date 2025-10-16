import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Conta = sequelize.define('Conta', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    img: DataTypes.STRING
}, {
    tableName: 'Contas'
});

export default Conta;
