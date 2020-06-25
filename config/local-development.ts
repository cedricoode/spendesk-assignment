export default {
  env: 'development',
  typeorm: {
    default: {
      host: 'localhost',
      port: 5432,
      usernmae: 'nodejs',
      database: 'spendesk',
      password: 'password',
    },
  },
  app: {
    port: 4000,
  },
};
