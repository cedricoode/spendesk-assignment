import { User } from './types';
import Wallet from './Wallet';
import Card from './Card';
import * as Helper from '../helper';
import Balance from './Balance';

export class CardFactory {
  static createCardFromWallet(wallet: Wallet, user: User) {
    const card = new Card();
    const balance = new Balance();
    balance.amount = 0;
    balance.currency = wallet.balance.currency;
    // card.balance = '0';
    card.blocked = false;
    // card.currency = wallet.currency;
    card.balance = balance;
    card.expireAt = new Date();
    card.userId = user.id;
    card.wallet = wallet;
    card.ccv = Helper.genRandomCvc();
    card.cardNumber = Helper.genRandomCard();
    return card;
  }
}

export default CardFactory;
