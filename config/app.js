/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './env';
import { genericErrors, constants } from '../app/utils';
import routes from '../app/routes';

const { notFoundError, serverError, successResponse } = genericErrors;
const {
  WELCOME,
  v1,
  WEBHOOK,
  CAR_DEALER_RUNNING,
  API_NOT_FOUND
} = constants;

const appConfig = (app) => {
  // integrate wiston logger with morgan
  app.use(morgan('combined', { stream: logger.stream }));
  // adds security middleware to handle potential attacks from HTTP requests
  app.use(helmet());
  // adds middleware for cross-origin resource sharing configuration
  app.use(cors());
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
  // app.use('/', routes);route
  // adds a heartbeat route for the culture
  app.get('/', (req, res) => successResponse(res, WELCOME));
  // Serves kue UI for viewing Jobs

  // catches 404 errors and forwards them to error handlers
  app.use((req, res, next) => {
    next(notFoundError(res, API_NOT_FOUND));
  });
  // handles all forwarded errors
  app.use((err, req, res, next) => serverError(req, res, err));

  // initialize the port constant
  const port = config.PORT || 8800;

  // server listens for connections
  app.listen(port, () => {
    logger.info(`${CAR_DEALER_RUNNING} ${port}`);
  });
};

export default appConfig;
