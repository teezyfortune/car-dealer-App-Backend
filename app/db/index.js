import db from './setup/postgres';
import { cloneRedisDB, redisDB } from './setup/redis';

export { db as default, redisDB, cloneRedisDB };
