import promise from 'bluebird';
import pg from 'pg-promise';
import config from '../../../config/env';

const options = {
  promiseLib: promise
};
const pgp = pg(options);
const db = pgp(config.CAR_DEALER_NODE_ENV === 'production'
  ? {
    port: config.DATABASE_PORT,
    user: config.DATABASE_USERNAME,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    ssl: true
  } : config.DATABASE_URL);
export default db;
