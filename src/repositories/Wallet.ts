import { getRepository, Repository, createQueryBuilder } from 'typeorm';
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
    return this.walletRepo.find({
      relations: ['balance'],
      where: { companyId: company },
    });
  }

  findById(id: number) {
    return this.walletRepo.findOne(id, { relations: ['balance'] });
  }

  findMasterWallet(currency: string) {
    this.walletRepo.createQueryBuilder('wallet');
    return this.walletRepo
      .find({
        relations: ['balance'],
        where: { isMaster: true },
      })
      .then((wallets) => wallets.filter((w) => w.currency === currency))
      .then((wallets) => (wallets.length > 0 ? wallets[0] : null));
  }
}

export default WalletRepository;
