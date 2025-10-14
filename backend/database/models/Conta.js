import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Conta = sequelize.define('Conta', {
    email: DataTypes.STRING,
    senha: DataTypes.STRING
}, {
    tableName: 'Contas'
});

export default Conta;
