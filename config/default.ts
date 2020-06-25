import path from 'path';
export default {
  typeorm: {
    default: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: 'password',
      database: 'spendesk',
      synchronize: true,
      logging: false,
      entities: [path.join(__dirname, '../src/entities/**/*')],
    },
  },
  knex: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'nodejs',
      password: 'password',
      database: 'spendesk',
    },
  },
  database: 'typeorm',
  env: 'development',
  app: {
    port: 4000,
  },
  spendesk: {
    transferFeeRate: 0.029,
  },
};
