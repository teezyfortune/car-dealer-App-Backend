import rootPath from 'app-root-path';
import development from './development';
import production from './production';
import test from './test';

const {
  CAR_DEALER_NODE_ENV: NODE_ENV,
  CAR_DEALER_PORT: PORT,
  CAR_DEALER_JWT_SECRET: JWT_SECRET,
  TSR_AWS_ACCESS_KEY: AWS_ACCESS_KEY,
  TSR_AWS_SECRET_KEY: AWS_SECRET_KEY,
  TSR_AWS_BUCKET: AWS_BUCKET_NAME,

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
  NODE_ENV,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME
};
