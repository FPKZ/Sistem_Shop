import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
//import { data } from "react-router-dom";

const Venda = sequelize.define('Venda', {
    data_venda: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    status: DataTypes.STRING,
    total: DataTypes.DECIMAL,
    desconto: DataTypes.DECIMAL,
    forma_pagamento: DataTypes.STRING,
}, {
    tableName: 'Vendas'
});

export default Venda;