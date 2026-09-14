import dotenv from 'dotenv';
import { connectDatabase } from '../config/database.js';
import { createMySQLModels } from './mysqlModels.js';

dotenv.config();

export const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();
export let sequelize = null;
export let models = {};

const initializeModels = async () => {
  if (dbType === 'mongodb') {
    await connectDatabase();
    const { User, Destination, Booking, Payment, Review } = await import('./mongooseModels.js');
    models = { User, Destination, Booking, Payment, Review };
  } else {
    sequelize = await connectDatabase();
    models = createMySQLModels(sequelize);
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ SQL models synchronized');
  }
};

await initializeModels();
