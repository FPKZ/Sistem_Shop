import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Nota = sequelize.define('Nota', {
    fornecedor: DataTypes.STRING,
    codigo: DataTypes.STRING,
    quantidade: DataTypes.INTEGER,
    valor_total: DataTypes.FLOAT,
    data: DataTypes.DATE
}, {
    tableName: 'Notas'
})

export default Nota;
