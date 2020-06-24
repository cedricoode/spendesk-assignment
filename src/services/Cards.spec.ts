import CardsService from './Cards';
import Wallet from '../entities/Wallet';
import Card from '../entities/Card';
import { Currencies } from '../entities/types';
import CardFactory from '../entities/CardFactory';
jest.mock('../repositories/Cards', () => {
  class CardRepo {}

  return CardRepo;
});

const mockUser = {
  id: '123',
  company: '456',
};
const mockIdNotExist = 1000;
const mockWallet = new Wallet();
mockWallet.balance = '100';
mockWallet.currency = Currencies.EUR;
mockWallet.isMaster = false;
mockWallet.id = 12;
mockWallet.companyId = mockUser.company;
const mockCard = CardFactory.createCardFromWallet(mockWallet, mockUser);
mockCard.id = 1;

jest.mock('./Wallet', () => {
  class WalletService {
    getCompanyWallet(companyId: string, walletId: number) {
      if (walletId === mockWallet.id) {
        return mockWallet;
      }
      return null;
    }
  }
  return WalletService;
});

jest.mock('../repositories/Cards', () => {
  class CardRepo {
    save(card: Card) {
      return mockCard;
    }

    findById(userId: string, cardId: number) {
      if (cardId === mockIdNotExist) {
        return null;
      }
      return mockCard;
    }

    findByUserId(userId: string) {
      return [mockCard];
    }
  }
  return CardRepo;
});

describe('CardsService', () => {
  describe('create', () => {
    it('should create a card', async () => {
      const cardsService = new CardsService();
      const card = await cardsService.create(mockUser, mockWallet.id);
      expect(card).toEqual(mockCard);
    });

    it('should throw an error, if the wallet does not exist', async () => {
      const cardsService = new CardsService();
      try {
        await cardsService.create(mockUser, -1);
      } catch (err) {
        expect(err.message).toMatch(/wallet not found/);
      }
    });
  });

  describe('getUserCard', () => {
    it('should get a card', async () => {
      const cardsService = new CardsService();
      const card = await cardsService.getUserCard(mockUser, mockCard.id);
      expect(card).toEqual(mockCard);
    });
  });
  describe('getUserCards', () => {
    it("should get all user's cards", async () => {
      const cardsService = new CardsService();
      const cards = await cardsService.getUserCards(mockUser);
      expect(cards).toEqual([mockCard]);
    });
  });
  describe('blockCard', () => {
    it('should block a card', async () => {
      const cardsService = new CardsService();
      const rslt = await cardsService.blockCard(mockUser, mockCard.id);
      expect(rslt).toBe(true);
    });

    it('should throw error, if card is not found', async () => {
      const cardsService = new CardsService();
      try {
        await cardsService.blockCard(mockUser, mockIdNotExist);
      } catch (err) {
        expect(err.message).toMatch(/card not found/);
      }
    });

    it('should return false, if card is already blocked', async () => {
      const cardsService = new CardsService();
      mockCard.blocked = true;
      const rslt = await cardsService.blockCard(mockUser, mockCard.id);
      mockCard.blocked = false;
      expect(rslt).toBe(false);
    });
  });
  describe('unblockCard', () => {
    it('should unblock a card', async () => {
      const cardsService = new CardsService();
      mockCard.blocked = true;
      const rslt = await cardsService.unblockCard(mockUser, mockCard.id);
      mockCard.blocked = false;
      expect(rslt).toBe(true);
    });
    it('should throw an error if card is not found ', async () => {
      const cardsService = new CardsService();
      try {
        await cardsService.unblockCard(mockUser, mockIdNotExist);
      } catch (err) {
        expect(err.message).toMatch(/card not found/);
      }
    });

    it('should return false if a card is already unblocked', async () => {
      const cardsService = new CardsService();
      const rslt = await cardsService.unblockCard(mockUser, mockCard.id);
      expect(rslt).toBe(false);
    });
  });
});
