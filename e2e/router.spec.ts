import { getRepository, createQueryBuilder } from 'typeorm';
import Dinero from 'dinero.js';
import supertest from 'supertest';
import config from 'config';
import TestSetup from './testSetup';
import Wallet from '../src/entities/Wallet';
import { Currencies } from '../src/entities/types';
import Card from '../src/entities/Card';
import Transfer from '../src/entities/Transfer';
import CardFactory from '../src/entities/CardFactory';
import Balance from '../src/entities/Balance';
import CurrencyService from '../src/services/Currency';

const testSetup = new TestSetup();
beforeAll(async () => {
  await testSetup.setup();
});
afterAll(async () => {
  await testSetup.teardown();
});

const mockUser = { id: '123', company: '456' };
const currencySerivce = new CurrencyService();

const mockMasterWallet1 = new Wallet();
mockMasterWallet1.balance = new Balance();
mockMasterWallet1.amount = 100000;
mockMasterWallet1.currency = Currencies.EUR;
mockMasterWallet1.companyId = mockUser.company;
mockMasterWallet1.isMaster = true;

const mockMasterWallet2 = new Wallet();
mockMasterWallet2.balance = new Balance();
mockMasterWallet2.amount = 100000;
mockMasterWallet2.currency = Currencies.USD;
mockMasterWallet2.companyId = mockUser.company;
mockMasterWallet2.isMaster = true;

const mockMasterWallet3 = new Wallet();
mockMasterWallet3.balance = new Balance();
mockMasterWallet3.amount = 100000;
mockMasterWallet3.currency = Currencies.USD;
mockMasterWallet3.companyId = mockUser.company;
mockMasterWallet3.isMaster = false;

const mockCard1 = CardFactory.createCardFromWallet(mockMasterWallet1, mockUser);
const mockCard2 = CardFactory.createCardFromWallet(mockMasterWallet2, mockUser);

beforeEach(async () => {
  const wallet1 = await getRepository(Wallet).save(mockMasterWallet1);
  const wallet2 = await getRepository(Wallet).save(mockMasterWallet2);
  const wallet3 = await getRepository(Wallet).save(mockMasterWallet3);
  mockMasterWallet1.id = wallet1.id;
  mockMasterWallet2.id = wallet2.id;
  mockMasterWallet3.id = wallet3.id;
  mockCard1.wallet = wallet1;
  mockCard2.wallet = wallet2;
  await getRepository(Card).save(mockCard1);
  await getRepository(Card).save(mockCard2);
});

afterEach(async () => {
  await createQueryBuilder(Card).delete().execute();
  await createQueryBuilder(Wallet).delete().execute();
  await createQueryBuilder(Transfer).delete().execute();
  await createQueryBuilder(Balance).delete().execute();
});

describe('/wallets', () => {
  describe('get /wallets', () => {
    it('should get a list of cards', async () => {
      await supertest(testSetup.server)
        .get('/api/wallets')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(new Set(Object.keys(res.body[0]))).toEqual(
            new Set(['id', 'currency', 'balance', 'isMaster', 'companyId'])
          );
        });
    });
  });

  describe('post wallets', () => {
    it('should create a master wallet', async () => {
      const requestBody = {
        balance: 1000,
        currency: 'GBP',
        isMaster: true,
      };
      await supertest(testSetup.server)
        .post('/api/wallets')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.balance).toBe(requestBody.balance);
          expect(body.currency).toBe(requestBody.currency);
          expect(body.isMaster).toBe(requestBody.isMaster);
          expect(body.companyId).toBe(mockUser.company);
        });
    });

    it('should throw an error if try to create a master wallet', async () => {
      const requestBody = {
        balance: 1000,
        currency: Currencies.EUR,
        isMaster: true,
      };
      await supertest(testSetup.server)
        .post('/api/wallets')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(requestBody)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/already exists/);
        });
    });

    it('should throw an error if try the balance is greater than 2**31 / 100', async () => {
      const requestBody = {
        balance: Math.floor(2 ** 31 / 100) + 1,
        currency: Currencies.EUR,
        isMaster: false,
      };
      await supertest(testSetup.server)
        .post('/api/wallets')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(requestBody)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/must be less than/);
        });
    });

    it('should throw an error if try the balance is negative', async () => {
      const requestBody = {
        balance: -1,
        currency: Currencies.EUR,
        isMaster: false,
      };
      await supertest(testSetup.server)
        .post('/api/wallets')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(requestBody)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/must be larger than/);
        });
    });
  });

  describe('get /wallets/:id', () => {
    it('should get the master wallet', async () => {
      await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet1.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ body }) => {
          expect(body.balance).toEqual(mockMasterWallet1.money.toUnit());
          expect(body.currency).toEqual(mockMasterWallet1.currency);
          expect(body.id).toEqual(mockMasterWallet1.id);
        });
    });

    it('should return 404 if not found', async () => {
      await supertest(testSetup.server)
        .get('/api/wallets/10000')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(404);
    });
  });

  describe('post /wallets/:id/cards', () => {
    it('should create card', async () => {
      await supertest(testSetup.server)
        .post(`/api/wallets/${mockMasterWallet1.id}/cards`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send()
        .expect(200)
        .then(({ body }) => {
          expect(body.cardNumber.length).toBe(16);
          expect(new Date(body.expiredAt).getTime() > Date.now()).toBe(true);
          expect(body.ccv.length).toEqual(3);
          expect(body.blocked).toBe(false);
          expect(body.balance).toEqual(0);
          expect(body.currency).toEqual(mockMasterWallet1.currency);
        });
    });
  });

  describe('get /cards', () => {
    it('should get a list of card', async () => {
      await supertest(testSetup.server)
        .get('/api/cards')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          expect(new Set(Object.keys(body[0]))).toEqual(
            new Set([
              'id',
              'cardNumber',
              'ccv',
              'balance',
              'currency',
              'blocked',
              'userId',
              'walletId',
              'expiredAt',
            ])
          );
        });
    });
  });

  describe('get /cards/:id', () => {
    it('should get the specified card', async () => {
      await supertest(testSetup.server)
        .get(`/api/cards/${mockCard2.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ body }) => {
          expect(body.id).toBe(mockCard2.id);
        });
    });

    it('should return not found if a card does not exist', async () => {
      await supertest(testSetup.server)
        .get('/api/cards/10000')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(404);
    });

    it('should return not found if the user does not have it', async () => {
      await supertest(testSetup.server)
        .get(`/api/cards/${mockCard2.id}`)
        .set('User-Id', 'notexist')
        .set('Company-Id', mockUser.company)
        .expect(404);
    });
  });

  describe('put /cards/:id/block', () => {
    it('should block a card', async () => {
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/block`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ blocked/);
        });
    });
    it('reblock a card has no effect', async () => {
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/block`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ blocked/);
        });
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/block`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ blocked/);
        });
    });
  });

  describe('put /cards/:id/unblock', () => {
    it('should unblock a card', async () => {
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/block`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ blocked/);
        });
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/unblock`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ unblocked/);
        });
    });
    it('reunblock a card will have no effect', async () => {
      await supertest(testSetup.server)
        .put(`/api/cards/${mockCard2.id}/unblock`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .expect(200)
        .then(({ text }) => {
          expect(text).toMatch(/card \d+ unblocked/);
        });
    });
  });

  describe('post /transfers', () => {
    it('should not transfer from the same account to the same account', async () => {
      const mockRequest = {
        from: mockMasterWallet1.id,
        fromType: 'WALLET',
        to: mockMasterWallet1.id,
        toType: 'WALLET',
        amount: '40',
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/invalid transfer/);
        });
    });

    it('should return 400 an error if payer is not found', async () => {
      const mockRequest = {
        from: 1000,
        fromType: 'WALLET',
        to: mockMasterWallet1.id,
        toType: 'WALLET',
        amount: '40',
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/payment method not found/);
        });
    });

    it('should return 400 if payee is not found', async () => {
      const mockRequest = {
        from: mockMasterWallet1.id,
        fromType: 'WALLET',
        to: 1000,
        toType: 'WALLET',
        amount: '40',
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/payment method not found/);
        });
    });
    it('should make the transfer betwene two master wallets and put the fee to the master wallet', async () => {
      const mockRequest = {
        from: mockMasterWallet1.id,
        fromType: 'WALLET',
        to: mockMasterWallet2.id,
        toType: 'WALLET',
        amount: 40,
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(200)
        .then(({ body }) => {
          expect(body.amount).toEqual(mockRequest.amount);
          expect(body.fromCurrency).toEqual(mockMasterWallet1.currency);
          expect(body.toCurrency).toEqual(mockMasterWallet2.currency);
          expect(body.from).toEqual(mockMasterWallet1.id);
          expect(body.to).toEqual(mockMasterWallet2.id);
          expect(body.fromType).toEqual(mockRequest.fromType);
          expect(body.toType).toEqual(mockRequest.toType);
        });
      const wallet1 = await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet1.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .then(({ body }) => body);
      const wallet2 = await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet2.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .then(({ body }) => body);

      expect(wallet1.balance * 100).toEqual(
        mockMasterWallet1.amount - mockRequest.amount * 100
      );
      const converted = await currencySerivce.convert(
        Dinero({
          amount: mockRequest.amount * 100,
          currency: wallet1.currency,
        }),
        wallet2.currency
      );
      expect(wallet2.balance).toEqual(
        mockMasterWallet2.money.add(converted).toUnit()
      );
    });
    it('should make the transfer between a wallet and a card and put the fee to the master wallet', async () => {
      const mockRequest = {
        from: mockMasterWallet1.id,
        fromType: 'WALLET',
        to: mockMasterWallet3.id,
        toType: 'WALLET',
        amount: 40,
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(200)
        .then(({ body }) => {
          expect(body.amount).toEqual(mockRequest.amount);
          expect(body.fromCurrency).toEqual(mockMasterWallet1.currency);
          expect(body.toCurrency).toEqual(mockMasterWallet3.currency);
          expect(body.from).toEqual(mockMasterWallet1.id);
          expect(body.to).toEqual(mockMasterWallet3.id);
          expect(body.fromType).toEqual(mockRequest.fromType);
          expect(body.toType).toEqual(mockRequest.toType);
        });
      const wallet1 = await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet1.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .then(({ body }) => body);
      const wallet2 = await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet2.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .then(({ body }) => body);
      const wallet3 = await supertest(testSetup.server)
        .get(`/api/wallets/${mockMasterWallet3.id}`)
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .then(({ body }) => body);
      expect(wallet1.balance * 100).toEqual(
        mockMasterWallet1.amount - mockRequest.amount * 100
      );
      const converted = await currencySerivce.convert(
        Dinero({
          amount: mockRequest.amount * 100,
          currency: wallet1.currency,
        }),
        wallet2.currency
      );
      expect(wallet2.balance).toEqual(
        mockMasterWallet2.money
          .add(converted.multiply(config.get('spendesk.transferFeeRate')))
          .toUnit()
      );
      expect(wallet3.balance).toEqual(
        mockMasterWallet3.money
          .add(
            converted.multiply(
              1 - Number(config.get('spendesk.transferFeeRate'))
            )
          )
          .toUnit()
      );
    });
    it('should return insufficient fund if there is not enough fund', async () => {
      const mockRequest = {
        from: mockMasterWallet1.id,
        fromType: 'WALLET',
        to: mockMasterWallet2.id,
        toType: 'WALLET',
        amount: 400000,
      };
      await supertest(testSetup.server)
        .post('/api/transfers')
        .set('User-Id', mockUser.id)
        .set('Company-Id', mockUser.company)
        .send(mockRequest)
        .expect(400)
        .then(({ text }) => {
          expect(text).toMatch(/insufficient fund/);
        });
    });
  });
});
