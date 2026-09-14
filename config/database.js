import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

dotenv.config();

const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

// ==================== SQLITE/SEQUELIZE ====================

export const initSQLiteConnection = async () => {
  try {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || './incredible_india.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    });

    await sequelize.authenticate();
    console.log('✓ SQLite Connection established');
    return sequelize;
  } catch (error) {
    console.error('SQLite Connection Error:', error.message);
    throw error;
  }
};

// ==================== MYSQL/SEQUELIZE ====================

export const initMySQLConnection = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

    await sequelize.authenticate();
    console.log('✓ MySQL Connection established');
    return sequelize;
  } catch (error) {
    console.error('MySQL Connection Error:', error.message);
    throw error;
  }
};

// ==================== MONGODB/MONGOOSE ====================

export const initMongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✓ MongoDB Connection established');
    return mongoose;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

// ==================== POSTGRESQL ====================

export const initPostgreSQLConnection = async () => {
  try {
    const sequelize = new Sequelize(
      process.env.POSTGRES_DATABASE,
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

    await sequelize.authenticate();
    console.log('✓ PostgreSQL Connection established');
    return sequelize;
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error.message);
    throw error;
  }
};

// ==================== MAIN CONNECTION MANAGER ====================

export const connectDatabase = async () => {
  switch (dbType) {
    case 'sqlite':
      return await initSQLiteConnection();
    case 'mysql':
      return await initMySQLConnection();
    case 'mongodb':
      return await initMongoDBConnection();
    case 'postgresql':
      return await initPostgreSQLConnection();
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
};

// Export for use in models
export { Sequelize, mongoose };
