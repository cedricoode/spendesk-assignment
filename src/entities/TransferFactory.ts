import Transfer from './Transfer';
import { WalletOrCard, Money } from './types';

class TransferFactory {
  static createTransfer(
    payer: WalletOrCard,
    payee: WalletOrCard,
    fee: Money,
    amount: Money
  ) {
    const transfer = new Transfer();
    transfer.amount = amount.getAmount();
    transfer.fromCurrency = payer.currency;
    transfer.toCurrency = payee.currency;
    transfer.from = payer.balance;
    transfer.to = payee.balance;
    transfer.timestamp = new Date();
    transfer.fromType = payer.type;
    transfer.toType = payee.type;
    transfer.conversionFee = fee.getAmount();
    return transfer;
  }
}

export default TransferFactory;
