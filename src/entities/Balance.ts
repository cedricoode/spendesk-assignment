import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Currencies } from './types';

@Entity('balances')
class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 16, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;
}

export default Balance;
