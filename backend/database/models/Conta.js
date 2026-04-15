import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Conta = sequelize.define('Conta', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    img: { type: DataTypes.STRING, defaultValue: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
    cargo: { type: DataTypes.STRING, defaultValue: "User" },
    tokenVersion: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'Contas'
});

export default Conta;
