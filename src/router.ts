import Router from '@koa/router';
import errorHandler from './middlewares/requestErrorHandler';

const router = new Router({
  prefix: '/api',
});

router.use(errorHandler());

export default router;
