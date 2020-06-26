import { Repository, getRepository } from 'typeorm';
import Card from '../entities/Card';
import { createLogger } from '../logger';

const logger = createLogger('CardsRepository');
class CardsRepository {
  _cardRepository: Repository<Card>;
  get cardRepo() {
    if (this._cardRepository) {
      return this._cardRepository;
    }

    try {
      this._cardRepository = getRepository(Card);
      return this._cardRepository;
    } catch (err) {
      logger.error('db is not initialized ');
      logger.error(err.message);
      throw err;
    }
  }

  save(card: Card) {
    return this.cardRepo.save(card);
  }

  findById(cardId: number) {
    return this.cardRepo.findOne(cardId, { relations: ['wallet', 'balance'] });
  }

  findByUserId(userId: string) {
    return this.cardRepo.find({
      relations: ['wallet', 'balance'],
      where: { userId },
    });
  }
}

export default CardsRepository;
