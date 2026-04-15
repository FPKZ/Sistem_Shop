import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Conta = sequelize.define('Conta', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    img: DataTypes.STRING,
    cargo: { type: DataTypes.STRING, defaultValue: "User"},
    tokenVersion: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'Contas'
});

export default Conta;
