import logger from '../logger';
import { Context } from 'koa';
export default function requestMiddleware() {
  return async (ctx: Context, next: () => Promise<void>) => {
    const startAt = Date.now();
    await next();
    logger.info(
      'REQUEST: %s %s %s %d ms - %d',
      ctx.method,
      ctx.url,
      ctx.status,
      Date.now() - startAt,
      ctx.length
    );
  };
}
