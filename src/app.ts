import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import swaggerMiddleware from './middlewares/swagger';
import requestLoggerMiddleware from './middlewares/requestLogger';
import router from './router';

/*******************************
 * middleware section
 *******************************/
const app = new Koa();
// request logging
app.use(requestLoggerMiddleware());

// add security headers if used in web application
app.use(helmet());

// parse request body
app.use(
  bodyParser({
    enableTypes: ['json'],
  })
);

// swagger ui
app.use(swaggerMiddleware());

// static content for ui documentation
app.use(serve('public'));

// routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
