import { Sequelize } from "sequelize";

const pedidosRegistros = new Sequelize({
    dialect: "sqlite",
    storage: "./backend/database/solicitacoes.db",
    logging: false
})

export default pedidosRegistros