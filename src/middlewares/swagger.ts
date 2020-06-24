import koaSwagger from 'koa2-swagger-ui';

export default function swaggerMiddleware() {
  return koaSwagger({
    routePrefix: '/swagger',
    hideTopbar: true,
    swaggerOptions: {
      jsonEditor: true,
      url: 'swagger.yml',
    },
  });
}
