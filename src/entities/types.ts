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
