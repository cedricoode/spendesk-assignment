import Transfer from './Transfer';
import { WalletOrCard } from './types';

class TransferFactory {
  static createTransfer(
    payer: WalletOrCard,
    payee: WalletOrCard,
    fee: number,
    amount: number
  ) {
    const transfer = new Transfer();
    transfer.amount = String(amount);
    transfer.fromCurrency = payer.currency;
    transfer.toCurrency = payee.currency;
    transfer.from = payer.balance;
    transfer.to = payee.balance;
    transfer.timestamp = new Date();
    transfer.fromType = payer.type;
    transfer.toType = payee.type;
    transfer.conversionFee = String(fee);
    return transfer;
  }
}

export default TransferFactory;
