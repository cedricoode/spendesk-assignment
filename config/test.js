/*eslint-disable*/
const path = require('path')
module.exports = {
  typeorm: {
    default: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: 'password',
      database: 'spendesk_test',
      synchronize: true,
      logging: false,
      entities: [path.join(__dirname, '../src/entities/**/*.ts')],
      cli: {},
    },
  },
  env: 'test',
};
