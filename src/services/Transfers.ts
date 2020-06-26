import Config from 'config';
import Dinero from 'dinero.js';
import CardsRepository from '../repositories/Cards';
import WalletRepository from '../repositories/Wallet';
import {
  PaymentType,
  User,
  Currencies,
  WalletOrCard,
  Money,
} from '../entities/types';
import CurrencyService from './Currency';
import { getManager } from 'typeorm';
import TransferFactory from '../entities/TransferFactory';
import Wallet from '../entities/Wallet';
import Card from '../entities/Card';

const FeeRate: number = Config.get('spendesk.transferFeeRate') || 0;

interface TransferDto {
  from: number;
  to: number;
  fromType: PaymentType;
  toType: PaymentType;
  amount: number;
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

  async create(user: User, transferDto: TransferDto) {
    // check payer type
    let payer = await this.getPaymentMethod(
      transferDto.fromType,
      transferDto.from
    );

    if (!payer) {
      throw new Error('payment method not found!');
    }

    if (
      !(payer instanceof Wallet && payer.companyId === user.company) &&
      !(payer instanceof Card && payer.userId === user.id)
    ) {
      throw new Error('not allowed');
    }

    // expired or blocked
    if (!payer.isValid()) {
      throw new Error('paying method is invalid!');
    }

    // check payee type
    let payee = await this.getPaymentMethod(transferDto.toType, transferDto.to);
    if (!payee) {
      throw new Error('payment method not found!');
    }

    // expired or blocked
    if (!payee.isValid()) {
      throw new Error('payee method is invalid!');
    }

    // reject if two accounts are the same
    if (payer.isEqual(payee)) {
      throw new Error('invalid transfer: from an account to the same account');
    }

    const { fromMoney, toMoney, fee } = await this.getTransferAmounts(
      transferDto.amount * 100,
      payer,
      payee
    );

    // check amount
    if (payer.amount < fromMoney.getAmount()) {
      throw new Error('insufficient funds');
    }

    // transfer
    return this.performTransfer(payer, payee, fromMoney, toMoney, fee);
  }

  async getPaymentMethod(type: PaymentType, id: number) {
    if (type === PaymentType.CARD) {
      return this.cardRepo.findById(id);
    } else {
      return this.walletRepo.findById(id);
    }
  }

  async getTransferMasterWallet(payer: WalletOrCard, payee: WalletOrCard) {
    if (payer.isMasterWallet() && payer.currency === payee.currency) {
      return payer;
    } else if (payee.isMasterWallet()) {
      return payee;
    }
    return await this.walletRepo.findMasterWallet(payee.currency);
  }

  performTransfer(
    payer: WalletOrCard,
    payee: WalletOrCard,
    fromMoney: Money,
    toMoney: Money,
    fee: Money
  ) {
    return getManager().transaction(async (entityManager) => {
      payer.takeBalance(fromMoney);
      payee.addBalance(toMoney);
      const transfer = TransferFactory.createTransfer(
        payer,
        payee,
        fee,
        fromMoney
      );

      const masterWallet = await this.getTransferMasterWallet(payer, payee);
      masterWallet.addBalance(fee);
      const balances = [payer.balance, payee.balance];
      if (!masterWallet.isEqual(payee) && !masterWallet.isEqual(payer)) {
        balances.push(masterWallet.balance);
      }
      await Promise.all(balances.map((balance) => entityManager.save(balance)));
      return transfer;
    });
  }

  async getTransferAmounts(
    amount: number,
    payer: WalletOrCard,
    payee: WalletOrCard
  ) {
    const fromMoney = Dinero({
      amount: amount,
      currency: payer.currency,
    });

    // conversion
    let toMoney = await this.currencyService.convert(fromMoney, payee.currency);
    const fee = this.calculateTransferFee(payer, payee, toMoney);

    // calculate fee
    // if payee is a card of payer do not calculate the fee
    toMoney = toMoney.subtract(fee);
    return {
      fromMoney,
      toMoney,
      fee,
    };
  }

  calculateTransferFee(payer: WalletOrCard, payee: WalletOrCard, money: Money) {
    return payer.isParent(payee) || payee.isParent(payer)
      ? money.multiply(0)
      : money.multiply(FeeRate);
  }
}

export default TransferService;
