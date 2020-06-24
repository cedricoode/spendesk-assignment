import { getRepository, Repository } from 'typeorm';
import Wallet from '../entities/Wallet';
import { createLogger } from '../logger';

const logger = createLogger('WalletRepository');

class WalletRepository {
  _walletRepository: Repository<Wallet>;

  get walletRepo() {
    if (this._walletRepository) {
      return this._walletRepository;
    }
    try {
      this._walletRepository = getRepository(Wallet);
      return this._walletRepository;
    } catch (err) {
      logger.error('db is not initialized! ');
      throw err;
    }
  }

  create(wallet: Wallet) {
    return this.walletRepo.save(wallet);
  }

  findByCompanyId(company: string) {
    return this.walletRepo.find({ where: { companyId: company } });
  }

  findById(companyId: string, id: number) {
    return this.walletRepo
      .find({ where: { companyId, id } })
      .then((wallets) => (wallets.length > 0 ? wallets[0] : null));
  }
}

export default WalletRepository;
