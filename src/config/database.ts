import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'riwimedicare_db';
const dbUser = process.env.DB_USER || process.env.POSTGRES_USER || 'nodejs';
const dbPassword = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '123456';
const dbHost = process.env.DB_HOST || process.env.POSTGRES_HOST || '172.28.0.2';
const dbPort = Number(process.env.DB_PORT || process.env.POSTGRES_PORT || 5432);

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

/**
 * Establece y sincroniza la conexión con la base de datos PostgreSQL
 */
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a la base de datos PostgreSQL establecida con éxito.');
    
    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log(' Modelos de Sequelize sincronizados con éxito.');
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};
