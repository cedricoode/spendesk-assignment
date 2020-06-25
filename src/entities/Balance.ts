import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import Dinero from 'dinero.js';
import { Currencies, IBalance, Money } from './types';

@Entity('balances')
class Balance implements IBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  amount: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  get money() {
    return Dinero({ amount: this.amount, currency: this.currency });
  }

  set money(m: Money) {
    this.amount = m.getAmount();
    this.currency = m.getCurrency() as Currencies;
  }

  addBalance(money: Money) {
    this.money = this.money.add(money);
  }

  takeBalance(money: Money) {
    this.money = this.money.subtract(money);
  }

  isEqual(balance: Balance) {
    return this.id === balance.id;
  }
}

export default Balance;
