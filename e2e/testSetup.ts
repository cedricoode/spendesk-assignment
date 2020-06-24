import { Server } from 'http';
import { createConnection, Connection } from 'typeorm';
import app from '../src/app';
import Config from '../configs';

export default class TestSetup {
  connection: Connection;
  server: Server;

  async setup() {
    this.server = app.listen(3000, () => {});
    this.connection = await createConnection(Config.typeorm.default);
  }

  async teardown() {
    this.connection && this.connection.close();
    this.server && this.server.close();
  }
}
