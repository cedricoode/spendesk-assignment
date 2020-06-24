import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Wallet from './Wallet';
import { Currencies } from './types';

@Entity('cards')
class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column('decimal', { precision: 16, scale: 2 })
  balance: string;

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

  @ManyToOne(() => Wallet, (wallet) => wallet.cards, { cascade: ['update'] })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}

export default Card;
