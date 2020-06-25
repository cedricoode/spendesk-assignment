import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Dinero from 'dinero.js';
import Card from './Card';
import Balance from './Balance';
import { Currencies, PaymentType, ICardWallet, Money } from './types';

@Entity('wallets')
class Wallet implements ICardWallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Balance, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @Column({ name: 'company_id', length: 40 })
  companyId: string;

  @Column('bool', { name: 'is_master', default: false })
  isMaster: boolean;

  @OneToMany(() => Card, (card) => card.wallet)
  cards: Card[];

  get currency() {
    return this.balance.currency;
  }

  set currency(currency: Currencies) {
    this.balance.currency = currency;
  }

  get amount() {
    return this.balance.amount;
  }

  set amount(amount: number) {
    this.balance.amount = amount;
  }

  get money() {
    return this.balance.money;
  }

  set money(m: Money) {
    this.balance.money = Dinero(m.toJSON());
  }

  get type() {
    return PaymentType.WALLET;
  }

  isValid() {
    return true;
  }

  addBalance(money: Money) {
    this.money = this.money.add(money);
  }

  takeBalance(money: Money) {
    this.money = this.money.subtract(money);
  }

  isEqual(payMethod: ICardWallet) {
    return this.type === payMethod.type && this.id === payMethod.id;
  }

  isMasterWallet() {
    return this.isMaster;
  }
}

export default Wallet;
