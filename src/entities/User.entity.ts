import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { Customer } from './Customer.entity';
import { AdminGroup } from './AdminGroup.entity';

@Entity('tb_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  User_Name!: string;

  @Column()
  User_Surname!: string;

  @Column({ unique: true, nullable: true })
  User_Email!: string;

  @Column({ nullable: true })
  User_Password!: string;

  @Column({ type: 'bigint' })
  User_Mobile_Number!: number;

  @Column({ type: 'text', nullable: true })
  User_Type!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Date_Created!: Date;


  @Column('text')
  Status!: string;

  @Column()
  Profile_Image!: string;

  @OneToOne(() => Customer, (customer) => customer.user, { eager: true })
  @JoinColumn()
  Customer_ID!: Customer;

  @OneToOne(()=> AdminGroup, (admin) => admin.user, {eager: true})
  @JoinColumn()
  Admin_ID!: AdminGroup
}
