import WalletService from './Wallet';
import Wallet from '../entities/Wallet';
import { Currencies } from '../entities/types';
import Balance from '../entities/Balance';

const mockUser = {
  id: '123',
  company: '456',
};
const mockWalletDto = {
  currency: Currencies.EUR,
  balance: 1,
  isMaster: false,
};
const mockWallet = new Wallet();
const balance = new Balance();
balance.amount = 100;
balance.currency = Currencies.EUR;
mockWallet.balance = balance;
mockWallet.isMaster = false;
mockWallet.id = 12;
mockWallet.companyId = mockUser.company;
const mockId = 789;

jest.mock('../repositories/Wallet', () => {
  class MockRepo {
    create(wallet: Wallet) {
      wallet.id = mockId;
      return wallet;
    }
    findByCompanyId(id: string) {
      return [mockWallet];
    }
    findById(companyId: string, id: number) {
      return mockWallet;
    }
  }

  return MockRepo;
});

describe('WalletService', () => {
  describe('createWallet', () => {
    it('should call the repository to create an wallet instance', async () => {
      const walletService = new WalletService();
      const wallet = await walletService.createWallet(mockUser, mockWalletDto);
      expect(wallet).toBeInstanceOf(Wallet);
      expect(wallet.companyId).toBe(mockUser.company);
      expect(wallet.isMaster).toBe(mockWalletDto.isMaster);
      expect(wallet.balance).toEqual(balance);
    });
  });
  describe('getCompanyWallets', () => {
    it('should return all wallets of a user', async () => {
      const walletService = new WalletService();
      const wallets = walletService.getCompanyWallets(mockUser.company);
      expect(Array.isArray(wallets)).toBe(true);
    });
  });

  describe('getCompanyWallet', () => {
    it('should return wallet for the company', async () => {
      const walletService = new WalletService();
      const wallet = await walletService.getCompanyWallet(
        mockUser.company,
        mockWallet.id
      );
      expect(wallet).toBeInstanceOf(Wallet);
      expect(wallet).toEqual(mockWallet);
    });
  });
});
