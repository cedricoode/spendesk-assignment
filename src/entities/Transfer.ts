import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Currencies, PaymentType } from './types';
import Balance from './Balance';

@Entity('transfers')
class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  timestamp: Date;

  @Column('integer')
  amount: Number;

  @Column({ name: 'from_currency', type: 'enum', enum: Currencies })
  fromCurrency: Currencies;

  @Column({ name: 'to_currency', type: 'enum', enum: Currencies })
  toCurrency: Currencies;

  @Column('integer')
  conversionFee: number;

  @ManyToOne((type) => Balance, { cascade: ['insert', 'update'] })
  @JoinColumn()
  from: Balance;

  @Column({ name: 'from_type', type: 'enum', enum: PaymentType })
  fromType: PaymentType;

  @ManyToOne((type) => Balance, { cascade: ['insert', 'update'] })
  @JoinColumn()
  to: Balance;

  @Column({ name: 'to_type', type: 'enum', enum: PaymentType })
  toType: string;
}

export default Transfer;
