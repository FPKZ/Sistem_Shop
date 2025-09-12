import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Cliente = sequelize.define('Cliente', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    endereco: DataTypes.STRING
}, {
    tableName: 'Clientes'
});

export default Cliente;
