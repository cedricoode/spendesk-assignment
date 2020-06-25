import om from 'object-mapper';
import Dinero from 'dinero.js';
import Balance from '../entities/Balance';
import Wallet from '../entities/Wallet';
import { WalletOrCard } from '../entities/types';

const balanceTransformer = [
  {
    key: 'balance',
    transform: (v: Balance) => v.money.toUnit(),
  },
  {
    key: 'currency',
    transform: (v: Balance) => v.currency,
  },
];
export const WalletToDTO = {
  id: 'id',
  companyId: 'companyId',
  isMaster: 'isMaster',
  balance: balanceTransformer,
};

export const CardToDTO = {
  id: 'id',
  cardNumber: 'cardNumber',
  expireAt: 'expiredAt',
  ccv: 'ccv',
  userId: 'userId',
  blocked: 'blocked',
  wallet: {
    key: 'walletId',
    transform: (w: Wallet) => w.id,
  },
  balance: balanceTransformer,
};

export const TransferToDTO = {
  amount: {
    key: 'amount',
    transform: (v: number, obj: any) =>
      Dinero({ amount: v, currency: obj.fromCurrency }).toUnit(),
  },
  fromCurrency: 'fromCurrency',
  toCurrency: 'toCurrency',
  from: {
    key: 'from',
    transform: (v: WalletOrCard) => v.id,
  },
  to: {
    key: 'to',
    transform: (v: WalletOrCard) => v.id,
  },
  timestamp: {
    key: 'timestamp',
    transfrom: (v: Date) => v.getTime(),
  },
  fromType: 'fromType',
  toType: 'toType',
  conversionFee: {
    key: 'conversionFee',
    transform: (amount: number, obj: any) =>
      Dinero({ amount: amount, currency: obj.toCurrency }).toUnit(),
  },
  id: 10,
};

export function dtoArrayTransformer(objs: Array<any>, transformer: any) {
  return objs.map((obj) => om(obj, {}, transformer));
}

export function dtoTransformer(obj: any, transformer: any) {
  return om(obj, {}, transformer);
}
