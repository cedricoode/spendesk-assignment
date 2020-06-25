import Dinero from 'dinero.js';
import TransferService from './Transfers';
import CardFactory from '../entities/CardFactory';
import { Currencies, PaymentType, Money } from '../entities/types';
import Card from '../entities/Card';
import Wallet from '../entities/Wallet';
import Balance from '../entities/Balance';

const mockUser = {
  id: '123',
  company: '456',
};
const mockIdNotExist = 1000;
const mockWallet = new Wallet();
const balance = new Balance();
balance.amount = 100;
balance.currency = Currencies.EUR;
mockWallet.balance = balance;
mockWallet.isMaster = false;
mockWallet.id = 12;
mockWallet.companyId = mockUser.company;
const mockCard = CardFactory.createCardFromWallet(mockWallet, mockUser);
mockCard.id = 1;

jest.mock('../repositories/Cards', () => {
  class CardRepo {
    findById(userId: string, id: number) {
      return mockCard;
    }
  }
  return CardRepo;
});

jest.mock('../repositories/Wallet', () => {
  class WalletRepo {
    findById(companyId: string, id: number) {
      return mockWallet;
    }
  }
  return WalletRepo;
});

jest.mock('./Currency', () => {
  class CurrencyService {
    convert(fromMoney: Money, toCurrency: Currencies) {
      return Dinero({ amount: fromMoney.getAmount(), currency: toCurrency });
    }
  }
  return CurrencyService;
});

describe('TransferService', () => {
  describe('getPaymentMethod', () => {
    it('should return card if card type is required', async () => {
      const transferService = new TransferService();
      const card = await transferService.getPaymentMethod(
        mockUser,
        PaymentType.CARD,
        mockCard.id
      );
      expect(card).toBeInstanceOf(Card);
    });
    it('should return card if wallet type is required', async () => {
      const transferService = new TransferService();
      const wallet = await transferService.getPaymentMethod(
        mockUser,
        PaymentType.WALLET,
        mockWallet.id
      );
      expect(wallet).toBeInstanceOf(Wallet);
    });

    describe('getTransferAmounts', () => {
      it('should return from, to and fee amount', async () => {
        const transferService = new TransferService();
        const {
          fromMoney,
          toMoney,
          fee,
        } = await transferService.getTransferAmounts(
          10,
          mockWallet,
          mockWallet
        );
        expect(fromMoney.getAmount()).toBe(10);
        expect(toMoney.getAmount() + fee.getAmount()).toBe(10);
      });
    });
  });
});
