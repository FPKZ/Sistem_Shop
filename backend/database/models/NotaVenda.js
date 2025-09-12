import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const NotaVenda = sequelize.define('NotaVenda', {
    codigo: DataTypes.STRING,
    valor_nota: DataTypes.FLOAT,
    forma_pagamento: DataTypes.STRING,
    status: DataTypes.STRING
}, {
    tableName: 'NotasVendas'
});