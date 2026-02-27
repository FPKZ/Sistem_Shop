import sequelize from "../sequelize.js";

const ItemVendido = sequelize.define("ItemVendido", {},{ tableName: "ItemVendido" })

export default ItemVendido