import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    tamanho: DataTypes.STRING,
    cor: DataTypes.STRING,
    img: DataTypes.STRING,
    descricao: DataTypes.STRING,
    valor_compra: DataTypes.FLOAT,
    valor_venda: DataTypes.FLOAT,
    lucro: DataTypes.FLOAT,
    entrada_estoque: DataTypes.INTEGER,
    saida_estoque: DataTypes.INTEGER,
    estoque_atual: DataTypes.INTEGER
}, {
    tableName: 'Produtos'
});

export default Produto;