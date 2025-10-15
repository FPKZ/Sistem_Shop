import { Sequelize } from 'sequelize';
import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.DATABASE_URL) {
    throw new Error("A variavel de ambiente DATABASE_URL não está definida.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
})

export default sequelize