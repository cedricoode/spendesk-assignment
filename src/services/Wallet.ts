import Wallet from '../entities/Wallet';
import WalletRepository from '../repositories/Wallet';
import { Currencies, User } from '../entities/types';
import Balance from '../entities/Balance';

export interface WalletDto {
  currency: Currencies;
  balance: string;
  isMaster: boolean;
  companyId?: string;
}

export class WalletService {
  walletRepo: WalletRepository;

  constructor() {
    this.walletRepo = new WalletRepository();
  }
  createWallet(user: User, walletDto: WalletDto) {
    const wallet = new Wallet();
    // wallet.currency = walletDto.currency;
    const balance = new Balance();
    balance.currency = walletDto.currency;
    balance.amount = walletDto.balance;
    wallet.companyId = user.company;
    wallet.balance = balance;
    wallet.isMaster = walletDto.isMaster;

    return this.walletRepo.create(wallet);
  }

  getCompanyWallets(companyId: string) {
    return this.walletRepo.findByCompanyId(companyId);
  }

  getCompanyWallet(companyId: string, id: number) {
    return this.walletRepo.findById(companyId, id);
  }
}

export default WalletService;
