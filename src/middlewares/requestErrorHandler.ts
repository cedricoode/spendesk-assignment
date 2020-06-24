import { Context } from 'koa';
import logger from '../logger';
const errorHandler = () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err) {
      if (err.statusCode) {
        ctx.status = err.statusCode;
        ctx.body = err.message;
      } else {
        logger.error('unhandled server error: ', err);
        ctx.status = 500;
      }
    }
  };
};

export default errorHandler;
