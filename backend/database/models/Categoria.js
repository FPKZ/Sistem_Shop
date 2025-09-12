import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Categoria = sequelize.define('Categoria', {
    nome: DataTypes.STRING,
}, {
    tableName: 'Categorias'
})

export default Categoria;
