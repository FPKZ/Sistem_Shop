import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Produto = sequelize.define('Produto', {
    nome: DataTypes.STRING,
    img: DataTypes.TEXT,
    imgs: DataTypes.ARRAY(DataTypes.TEXT),
    descricao: DataTypes.TEXT,
}, {
    tableName: 'Produtos'
});

// Hook para sincronizar o nome com os Itens de Estoque após a atualização
Produto.addHook('afterUpdate', async (produto, options) => {
    // Só dispara se o nome tiver sido alterado
    if (produto.changed('nome')) {
        const ItemEstoque = produto.sequelize.models.ItemEstoque;
        if (ItemEstoque) {
            await ItemEstoque.update(
                { nome: produto.nome },
                { 
                    where: { produto_id: produto.id },
                    transaction: options.transaction // Mantém a transação se houver uma
                }
            );
        }
    }
});

export default Produto;