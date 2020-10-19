/* eslint-disable no-plusplus */
import cluster from 'cluster';
import express from 'express';
import config, { appConfig } from './config';
import initLogger from './config/logger';
// create express app
const app = express();
// initialize logger
const winstonLogger = initLogger(config.NODE_ENV);
// sets logger as a global variable
global.logger = winstonLogger;

// This is not the master process, so we spawn the express server.
appConfig(app);
logger.info(`Worker ${process.pid} started`);

// creating a new process if a worker die.
cluster.on('exit', (worker) => {
  logger.info(`Worker ${worker.id} died'`);
  logger.info('Staring a new one...');
  cluster.fork();
});

export default app;
