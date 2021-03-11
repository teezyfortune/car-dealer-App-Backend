/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressFileUpload from 'express-fileupload';
import config from './env';
import { constants, genericErrors, Helper } from '../app/utils';
import routes from '../app/routes';
import { redisDB } from '../app/db/setup/redis';

const { notFoundApi } = genericErrors;
const { successResponse } = Helper;

const {
  constants: {
    WELCOME,
    WEBHOOK,
    CAR_DEALER_RUNNING,
    REDIS_RUNNING,
  } } = constants;

const appConfig = (app) => {
  // integrate wiston logger with morgan
  app.use(morgan('combined', { stream: logger.stream }));
  // adds security middleware to handle potential attacks from HTTP requests
  app.use(helmet());
  // adds middleware for cross-origin resource sharing configuration
  app.use(cors());

  // Allows multipart data to be sent
  app.use(expressFileUpload({ useTempFiles: true }));
  // adds middleware that parses requests whose content-type is application/json
  app.use(
    json({
      verify: (req, res, buffer) => {
        if (req.url.startsWith(WEBHOOK)) {
          req.rawBody = buffer;
        }
      }
    })
  );
  // adds middleware that parses requests with x-www-form-urlencoded data encoding
  app.use(urlencoded({ extended: true }));

  // serves api route
  app.use('/api/v1', routes);

  // adds a heartbeat route for the culture
  app.get('/', (req, res) => successResponse(res, { message: WELCOME }));
  // catches 404 errors and forwards them to error handlers
  app.use((req, res, next) => {
    next(notFoundApi);
  });

  // handles all forwarded errors
  app.use((err, req, res, next) => Helper.errorResponse(req, res, err));
  redisDB.on('connect', () => logger.info(REDIS_RUNNING));

  // initialize the port constant
  const port = config.PORT || 8800;

  // server listens for connections
  app.listen(port, () => {
    logger.info(`${CAR_DEALER_RUNNING} ${port}`);
  });
};

export default appConfig;
