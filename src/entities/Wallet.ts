import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Card from './Card';
// import { Currencies } from './types';
import Balance from './Balance';
import { Currencies, PaymentType } from './types';

@Entity('wallets')
class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'enum', enum: Object.values(Currencies) })
  // currency: Currencies;
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
  }

  get type() {
    return PaymentType.WALLET;
  }

  isValid() {
    return true;
  }

  @OneToOne(() => Balance, { cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @Column({ name: 'company_id', length: 40 })
  companyId: string;

  @Column('bool', { name: 'is_master', default: false })
  isMaster: boolean;

  @OneToMany(() => Card, (card) => card.wallet)
  cards: Card[];
}

export default Wallet;
