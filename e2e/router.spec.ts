import { getManager, getConnection, getRepository } from 'typeorm';
import supertest from 'supertest';
import TestSetup from './testSetup';


const testSetup = new TestSetup();
beforeAll(async () => {
  await testSetup.setup();
});
afterAll(async () => {
  await testSetup.teardown();
});

