import redis from 'redis';
import { promisifyAll } from 'bluebird';
import config from '../../../config/env';

// promisify redis to enable the use of ES6 promises features.
promisifyAll(redis);

const { NODE_ENV, REDIS_URL } = config;

// Creates an instance of a Redis client.
const redisDB = REDIS_URL ? redis.createClient(REDIS_URL) : redis.createClient();

// Selects a different database while in the testing environment
if (NODE_ENV === 'test') {
  redisDB.select(3, async (err) => {
    if (err) {
      logger.error(`An Error occurred while spawning a 
    new Redis database with the following message: ${err.message}`);
      process.exit(1);
    } else {
      try {
        await redisDB.flushdbAsync();
      } catch (e) {
        logger.error(`An Error occurred while removing test keys with the message: ${e.message}`);
      }
    }
  });
}

// Spawns a new redis connection instance that holds
// the same configuration as the client above with an option to change configurations.
const cloneRedisDB = (options = {}) => redisDB.duplicate(options,);

export {
  redisDB, cloneRedisDB
};
