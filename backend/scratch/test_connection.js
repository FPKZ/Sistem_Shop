import { Sequelize } from 'sequelize';

const url1 = 'postgresql://postgres.gtuhybkgwuvdunpdgyqt:romafeni1706@aws-1-us-east-1.pooler.supabase.com:6543/postgres';
const url2 = 'postgresql://postgres.sbjiewcgqvwonuismfgt:romafeni1706@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

async function test(url, name) {
  console.log(`Testando ${name}...`);
  const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  try {
    await sequelize.authenticate();
    console.log(`Conexão com ${name} estabelecida com sucesso!`);
    await sequelize.close();
    return true;
  } catch (err) {
    console.error(`Erro ao conectar com ${name}:`, err.message);
    return false;
  }
}

async function run() {
  await test(url1, 'DATABASE_URL_1 (gtuhybkgwuvdunpdgyqt)');
  await test(url2, 'DATABASE_URL_2 (sbjiewcgqvwonuismfgt)');
}

run();
