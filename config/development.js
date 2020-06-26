/*eslint-disable*/
const path = require('path')

module.exports = {
  env: 'development',
  typeorm: {
    default: {
      host: 'localhost',
      port: 5432,
      usernmae: 'nodejs',
      database: 'spendesk',
      password: 'password',
      entities: [path.join(__dirname, '../build/entities/**/*.js')]
    },
  },
  app: {
    port: 4000,
  },
  fixerio: {
    accessKey: '78eda250a4f3d1e8e1a53c402c3c95d7'
  }
};
