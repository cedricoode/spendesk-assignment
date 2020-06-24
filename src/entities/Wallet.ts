import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Currencies {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}

@Entity('wallet')
class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Currencies })
  currency: Currencies;

  @Column('decimal', { precision: 16, scale: 2 })
  balance: string;

  @Column({ name: 'company_id', length: 40 })
  companyId: string;

  @Column('bool', { name: 'is_master', default: false })
  isMaster: boolean;
}

export default Wallet;
