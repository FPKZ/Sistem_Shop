import { DataTypes } from "sequelize";
import pedidosRegistros from "../pedidos-registros.js";

const Solicitacao = pedidosRegistros.define("solicitacao",{
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: "pendente"}
})

export default Solicitacao