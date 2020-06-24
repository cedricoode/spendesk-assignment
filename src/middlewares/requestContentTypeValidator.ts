import { Context } from 'koa';

class InvalidContentTypeError extends Error {
  statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = 415;
  }
}

const requestTypeValidatorMiddleware = (acceptedTypes: string[]) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const type = ctx.is(acceptedTypes);
    if (!type) {
      throw new InvalidContentTypeError(ctx.get('Content-Type'));
    }
    await next();
  };
};

export default requestTypeValidatorMiddleware;
