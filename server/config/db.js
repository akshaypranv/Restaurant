const { Pool } = require('pg');
const config = require('./config');

const sslConfig = config.DATABASE_URL && (config.DATABASE_URL.includes('localhost') || config.DATABASE_URL.includes('127.0.0.1'))
  ? false
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: sslConfig
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
