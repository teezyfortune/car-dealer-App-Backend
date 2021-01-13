import { S3 as _S3 } from 'aws-sdk';
import config from '../env';

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } = config;
const S3 = new _S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  ACL: 'public-read'
});

export default { AWS_BUCKET_NAME, S3 };
