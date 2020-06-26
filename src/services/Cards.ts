import CardsRepository from '../repositories/Cards';
import WalletService from './Wallet';
import { User } from '../entities/types';
import { CardFactory } from '../entities/CardFactory';

class CardsService {
  cardsRepo: CardsRepository;
  walletService: WalletService;
  constructor() {
    this.cardsRepo = new CardsRepository();
    this.walletService = new WalletService();
  }

  async create(user: User, walletId: number) {
    const wallet = await this.walletService.getCompanyWallet(
      user.company,
      walletId
    );
    if (!wallet) {
      throw new Error('wallet not found');
    }
    const card = CardFactory.createCardFromWallet(wallet, user);

    return this.cardsRepo.save(card);
  }

  async getUserCard(user: User, cardId: number) {
    const card = await this.cardsRepo.findById(cardId);
    if (card && card.userId === user.id) {
      return card;
    }
    return null;
  }

  async getUserCards(user: User) {
    return this.cardsRepo.findByUserId(user.id);
  }

  async blockCard(user: User, cardId: number) {
    const card = await this.cardsRepo.findById(cardId);
    if (!card || card.userId !== user.id) {
      throw new Error('card not found');
    }
    if (card.blocked) {
      return false; // already blocked
    }

    card.addBalance(card.money);
    card.blocked = true;
    card.amount = 0;
    await this.cardsRepo.save(card);
    return true;
  }

  async unblockCard(user: User, cardId: number) {
    const card = await this.cardsRepo.findById(cardId);
    if (!card || card.userId !== user.id) {
      throw new Error('card not found');
    }

    if (!card.blocked) {
      return false; // already unblocked
    }

    card.blocked = false;
    await this.cardsRepo.save(card);
    return true;
  }
}

export default CardsService;
