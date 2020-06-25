import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import Wallet from './Wallet';
// import { Currencies } from './types';
import Balance from './Balance';
import { Currencies, PaymentType } from './types';

@Entity('cards')
class Card {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'enum', enum: Currencies })
  // currency: Currencies;

  // @Column('decimal', { precision: 16, scale: 2 })
  get currency() {
    return this.balance.currency;
  }

  set currency(currency: Currencies) {
    this.balance.currency = currency;
  }

  get amount() {
    return this.balance.amount;
  }

  set amount(amount: string) {
    this.balance.amount = amount;
  } // balance: string;
  get type() {
    return PaymentType.CARD;
  }

  isValid() {
    // if blocked, it is not valid
    if (this.blocked) {
      return false;
    }

    // if expired, it is not valid
    if (this.expireAt < new Date()) {
      return false;
    }

    return true;
  }

  @Column({ length: 16, name: 'card_number' })
  cardNumber: string;

  @Column('date', { name: 'expire_at' })
  expireAt: Date;

  @Column({ length: 3 })
  ccv: string;

  @Column({ name: 'user_id' })
  userId: string; // not stored in database

  @Column()
  blocked: boolean;

  @OneToOne((type) => Balance, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @ManyToOne(() => Wallet, (wallet) => wallet.cards, { cascade: ['update'] })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}

export default Card;
