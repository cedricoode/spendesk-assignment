import Card from './Card';
import Wallet from './Wallet';

export enum Currencies {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}

export enum PaymentType {
  WALLET = 'WALLET',
  CARD = 'CARD',
}

export type WalletOrCard = Wallet | Card;

export interface User {
  id: string;
  company: string;
}

export interface FixerIOResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

export type Money = Dinero.Dinero;

export interface IBalance {
  id: number;
  currency: Currencies;
  amount: number;
  money: Money;
  // type: PaymentType;
  isEqual(payMethod: IBalance): boolean;
  addBalance(money: Money): void;
  takeBalance(money: Money): void;
}

export interface ICardWallet extends IBalance {
  type: PaymentType;
  isValid(): boolean;
  isMasterWallet(): boolean;
}
