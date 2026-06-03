const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = {
  DATABASE_URL: (val) => {
    if (!val) return 'DATABASE_URL is required.';
    if (!val.startsWith('postgresql://') && !val.startsWith('postgres://')) {
      return 'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://';
    }
    return null;
  },
  JWT_SECRET: (val) => {
    if (!val) return 'JWT_SECRET is required.';
    if (val.length < 32) {
      return 'JWT_SECRET must be at least 32 characters long to be secure.';
    }
    return null;
  }
};

const errors = [];

for (const [key, validator] of Object.entries(requiredEnvVars)) {
  const value = process.env[key];
  const error = validator(value);
  if (error) {
    errors.push(error);
  }
}

if (errors.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Configuration Error: Application cannot start due to the following environment issues:');
  errors.forEach(err => console.error('\x1b[31m%s\x1b[0m', `- ${err}`));
  throw new Error('Invalid environment configuration');
}

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173']
};
