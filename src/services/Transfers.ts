import Config from 'config';
import CardsRepository from '../repositories/Cards';
import WalletRepository from '../repositories/Wallet';
import { PaymentType, User } from '../entities/types';
import CurrencyService from './Currency';
import { getManager } from 'typeorm';
import TransferFactory from '../entities/TransferFactory';

const FeeRate: number = Config.get('spendesk.transferFeeRate') || 0;

interface TransferDto {
  from: number;
  to: number;
  fromType: PaymentType;
  toType: PaymentType;
  amount: string;
}
class TransferService {
  cardRepo: CardsRepository;
  walletRepo: WalletRepository;
  currencyService: CurrencyService;

  constructor() {
    this.cardRepo = new CardsRepository();
    this.walletRepo = new WalletRepository();
    this.currencyService = new CurrencyService();
  }

  async getPaymentMethod(user: User, type: PaymentType, id: number) {
    if (type === PaymentType.CARD) {
      return this.cardRepo.findById(user.id, id);
    } else {
      return this.walletRepo.findById(user.company, id);
    }
  }
  async create(user: User, transferDto: TransferDto) {
    // check payer type
    let payer = await this.getPaymentMethod(
      user,
      transferDto.fromType,
      transferDto.from
    );
    if (!payer) {
      throw new Error('payment method not found!');
    }

    // expired or blocked
    if (!payer.isValid()) {
      throw new Error('paying method is invalid!');
    }

    // check payee type
    let payee = await this.getPaymentMethod(
      user,
      transferDto.toType,
      transferDto.to
    );
    if (!payee) {
      throw new Error('payment method not found!');
    }

    if (!payee.isValid()) {
      throw new Error('payee method is invalid!');
    }

    // reject if two accounts are the same
    if (payer.type === payee.type && payer.id === payee.id) {
      throw new Error('invalid transfer: from an account to the same account');
    }

    // conversion
    let fromAmount = Number(transferDto.amount);
    let toAmount = Number(
      await this.currencyService.convert(
        payer.currency,
        payee.currency,
        transferDto.amount
      )
    );

    // check amount
    if (Number(payer.amount) < fromAmount) {
      throw new Error('insufficient funds');
    }

    // calculate fee
    const fee = toAmount * FeeRate;
    toAmount = toAmount - fee;

    // transfer
    payer.amount = '' + (Number(payer.amount) - fromAmount);
    payee.amount = '' + (Number(payee.amount) + toAmount);
    const transfer = TransferFactory.createTransfer(
      payer,
      payee,
      fee,
      fromAmount
    );

    await getManager().transaction(async (entityManager) => {
      await entityManager.save(transfer);

      const masterWallet = await this.walletRepo.findMasterWallet(
        payee.currency
      );
      masterWallet.amount = '' + (Number(masterWallet.amount) + fee);
      await entityManager.save(masterWallet);
    });
    return transfer;
  }
}

export default TransferService;
