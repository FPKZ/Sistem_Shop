import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const ItemVendido = sequelize.define("ItemVendido", {
    valor_produto: DataTypes.FLOAT,
},{
    tableName: "ItemVendido"
})

export default ItemVendido