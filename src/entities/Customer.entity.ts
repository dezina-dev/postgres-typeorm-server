import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './User.entity';

@Entity('tb_customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  Customer_Name!: string;

  @Column({ nullable: true })
  Address!: string;

  @Column({ type: 'bigint' })
  Customer_Contact!: number;

  @OneToOne((type) => User, (user: any) => user.Customer_ID)
  user!: User;
}
