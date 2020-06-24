import 'reflect-metadata';
import config from 'config';
import app from './app';
import logger from './logger';
import './database';

process.on('uncaughtException', (err) => {
  logger.error('unhandled application error ', err);
  process.exit(1);
});

app.listen(config.get('app.port'), () => {
  logger.info(`server is running on: ${config.get('app.port')}`);
});
