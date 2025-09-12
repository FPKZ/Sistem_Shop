import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const ItemVendido = sequelize.define("ItemVendido", {
    valor_venda: DataTypes.FLOAT,
},{
    tableName: "ItemVendido"
})

export default ItemVendido