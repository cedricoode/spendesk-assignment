import { createConnection } from 'typeorm';
import config from 'config';
import logger from './logger';
import knex from 'knex';
/*******************************
 * database section
 ********************************/
const RETRY = 5;
let timeoutHandle: any;
function connectToDatabase(retryCount: number) {
  createConnection(config.get('typeorm.default')).then(
    async () => {
      logger.info(`connected to database using: ${config.get('database')}`);
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    },
    (error) => {
      if (retryCount > RETRY) {
        logger.error(
          `connection failed after ${retryCount} retries, exiting...`
        );
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
        throw error;
      }
      let waitTime = retryCount ** 2;
      logger.warn(
        `connection failed, retry in ${waitTime} seconds to retry...`,
        error
      );
      timeoutHandle = setTimeout(() => {
        connectToDatabase(retryCount + 1);
      }, waitTime * 1000);
    }
  );
}
if (config.get('database') === 'typeorm') {
  connectToDatabase(1);
} else if (config.get('database') === 'knex') {
  knex(config.get('knex'))
    .raw("SELECT 'test connection';")
    .then(() => {
      logger.info(`connected to database using: ${config.get('database')}`);
    })
    .catch((err) => {
      logger.error('error connecting to database');
      throw err;
    });
}
