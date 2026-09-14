#!/usr/bin/env node

// Backend Setup Guide

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const setupGuide = async () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🇮🇳 INCREDIBLE INDIA - BACKEND SETUP 🇮🇳         ║
╚════════════════════════════════════════════════════╝

This script will help you set up the Node.js backend.
  `);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'database',
      message: 'Which database would you like to use?',
      choices: ['MySQL', 'MongoDB', 'PostgreSQL']
    },
    {
      type: 'input',
      name: 'jwtSecret',
      message: 'Enter a JWT Secret (or press Enter for default):',
      default: 'change-this-secret-in-production'
    },
    {
      type: 'input',
      name: 'frontendUrl',
      message: 'Frontend URL (for CORS):',
      default: 'http://localhost:5501'
    }
  ]);

  const dbConfigs = {
    MySQL: {
      DB_TYPE: 'mysql',
      MYSQL_HOST: 'localhost',
      MYSQL_PORT: 3306,
      MYSQL_USER: 'root',
      MYSQL_PASSWORD: 'password',
      MYSQL_DATABASE: 'incredible_india'
    },
    MongoDB: {
      DB_TYPE: 'mongodb',
      MONGODB_URI: 'mongodb://localhost:27017/incredible_india'
    },
    PostgreSQL: {
      DB_TYPE: 'postgresql',
      POSTGRES_HOST: 'localhost',
      POSTGRES_PORT: 5432,
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'password',
      POSTGRES_DATABASE: 'incredible_india'
    }
  };

  const selectedConfig = dbConfigs[answers.database];

  // Update .env file
  let envContent = fs.readFileSync('.env.example', 'utf-8');
  
  for (const [key, value] of Object.entries(selectedConfig)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    envContent = envContent.replace(regex, `${key}=${value}`);
  }
  
  envContent = envContent.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${answers.jwtSecret}`);
  envContent = envContent.replace(/^CORS_ORIGIN=.*$/m, `CORS_ORIGIN=${answers.frontendUrl}`);

  fs.writeFileSync('.env', envContent);

  console.log(`
✓ Configuration saved to .env file

Next steps:
1. Review and update .env file with your database credentials
2. Ensure your database server is running
3. Run: npm install
4. Run: npm run init-db
5. Run: npm run dev

Database Setup Instructions:

${answers.database === 'MySQL' ? `
📦 MySQL Setup:
   - Download: https://www.mysql.com/downloads/
   - Create database:
     mysql -u root -p
     CREATE DATABASE incredible_india;
` : ''}

${answers.database === 'MongoDB' ? `
📦 MongoDB Setup:
   - Download: https://www.mongodb.com/try/download/community
   - Start service and verify connection
` : ''}

${answers.database === 'PostgreSQL' ? `
📦 PostgreSQL Setup:
   - Download: https://www.postgresql.org/download/
   - Create database:
     createdb incredible_india
` : ''}
  `);
};

setupGuide().catch(console.error);
