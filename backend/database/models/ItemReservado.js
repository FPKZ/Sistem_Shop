import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const ItemReservado = sequelize.define(
  "ItemReservado",
  {
    cliente_id: DataTypes.INTEGER,
    itemEstoque_id: DataTypes.INTEGER,
    data: DataTypes.DATE,
  },
  {
    tableName: "ItemReservado",
  }
);

export default ItemReservado;
