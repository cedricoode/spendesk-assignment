import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import Dinero from 'dinero.js';
import Wallet from './Wallet';
import Balance from './Balance';
import {
  Currencies,
  PaymentType,
  ICardWallet,
  Money,
  WalletOrCard,
} from './types';

@Entity('cards')
class Card implements ICardWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, name: 'card_number', unique: true })
  cardNumber: string;

  @Column('date', { name: 'expire_at' })
  expireAt: Date;

  @Column({ length: 3 })
  ccv: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  blocked: boolean;

  @OneToOne(() => Balance, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @ManyToOne(() => Wallet, (wallet) => wallet.cards, { cascade: ['update'] })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  addBalance(money: Money) {
    this.money = this.money.add(money);
  }

  takeBalance(money: Money) {
    this.money = this.money.subtract(money);
  }

  isEqual(paymentMethod: ICardWallet) {
    return this.type === paymentMethod.type && this.id === paymentMethod.id;
  }

  isMasterWallet() {
    return false;
  }
  get currency() {
    return this.balance.currency;
  }

  set currency(currency: Currencies) {
    this.balance.currency = currency;
  }

  get amount() {
    return this.balance.amount;
  }

  get money() {
    return this.balance.money;
  }

  set money(m: Money) {
    this.balance.money = Dinero(m.toJSON());
  }

  set amount(amount: number) {
    this.balance.amount = amount;
  }
  get type() {
    return PaymentType.CARD;
  }

  isValid() {
    // if blocked, it is not valid
    if (this.blocked) {
      return false;
    }

    // if expired, it is not valid
    if (new Date(this.expireAt).getTime() < Date.now()) {
      return false;
    }

    return true;
  }

  isParent(child: WalletOrCard) {
    return false;
  }
}

export default Card;
