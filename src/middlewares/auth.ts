import { Context } from 'koa';

export default function authMiddleware() {
  return async (ctx: Context, next: () => Promise<void>) => {
    const userId = ctx.request.get('User-Id');
    const companyId = ctx.request.get('Company-Id');
    if (!userId || !companyId) {
      ctx.status = 403;
      return;
    }
    ctx.state.user = { id: userId, company: companyId };
    await next();
  };
}
