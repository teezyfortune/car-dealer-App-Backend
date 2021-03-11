import 'dotenv/config';

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  username: process.env.PRODUCTION_USERNAME,
  password: process.env.PRODUCTION_PASSWORD,
  database: process.env.PRODUCTION_DATABASE,
  host: process.env.PRODUCTION_HOST,
  port: process.env.PRODUCTION_PORT,
  ssl: true
};
