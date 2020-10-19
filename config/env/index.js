import rootPath from 'app-root-path';
import development from './development';
import production from './production';
import test from './test';

const {
  CAR_DEALER_NODE_ENV: NODE_ENV,
  CAR_DEALER_PORT: PORT,
  CAR_DEALER_JWT_SECRET: JWT_SECRET
} = process.env;

const presentEnv = {
  development,
  production,
  test
}[NODE_ENV || 'development'];

export default {
  ...process.env,
  ...presentEnv,
  rootPath,
  PORT,
  JWT_SECRET,
  NODE_ENV
};
