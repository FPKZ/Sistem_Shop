import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
//import { data } from "react-router-dom";

const Venda = sequelize.define(
  "Venda",
  {
    data_venda: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    status: DataTypes.STRING,
    valor_total: DataTypes.FLOAT,
    desconto: DataTypes.FLOAT,
    prazo_reserva: DataTypes.DATE,
  },
  {
    tableName: "Vendas",
  },
);

export default Venda;

/*
cliente_id: cliente.id,
data_venda: new Date().toISOString(),
notaVenda: pagamentos,
desconto: desconto,
valor_total: calcularTotal(),
status: "concluida",
itensVendidos: itens,
*/
