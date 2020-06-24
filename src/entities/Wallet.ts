import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Card from './Card';
import { Currencies } from './types';

@Entity('wallet')
class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Object.values(Currencies) })
  currency: Currencies;

  @Column('decimal', { precision: 16, scale: 2 })
  balance: string;

  @Column({ name: 'company_id', length: 40 })
  companyId: string;

  @Column('bool', { name: 'is_master', default: false })
  isMaster: boolean;

  @OneToMany(() => Card, (card) => card.wallet)
  cards: Card[];
}

export default Wallet;
