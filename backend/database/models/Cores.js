import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Cores = sequelize.define('Cores', {
    name: DataTypes.STRING,
    hex: DataTypes.STRING
}, {
    tableName: 'Cores'
});

export default Cores;