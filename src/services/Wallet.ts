import Wallet from '../entities/Wallet';
import WalletRepository from '../repositories/Wallet';
import { Currencies, User } from '../entities/types';
import Balance from '../entities/Balance';

export interface WalletDto {
  currency: Currencies;
  balance: number;
  isMaster: boolean;
  companyId?: string;
}

export class WalletService {
  walletRepo: WalletRepository;

  constructor() {
    this.walletRepo = new WalletRepository();
  }
  async createWallet(user: User, walletDto: WalletDto) {
    const wallet = new Wallet();
    const balance = new Balance();
    balance.currency = walletDto.currency;
    balance.amount = walletDto.balance * 100;
    wallet.companyId = user.company;
    wallet.balance = balance;
    wallet.isMaster = walletDto.isMaster;
    if (wallet.isMaster) {
      const masterWallet = await this.walletRepo.findMasterWallet(
        wallet.currency
      );
      if (masterWallet) {
        throw new Error(`master wallet(${wallet.currency}) already exists!`);
      }
    }

    return this.walletRepo.create(wallet);
  }

  getCompanyWallets(companyId: string) {
    return this.walletRepo.findByCompanyId(companyId);
  }

  async getCompanyWallet(companyId: string, id: number) {
    const wallet = await this.walletRepo.findById(id);
    return wallet && wallet.companyId === companyId ? wallet : null;
  }
}

export default WalletService;
