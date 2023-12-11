import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('tb_orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  OrderName!: string;

  @Column()
  TotalCost!: number;

  @ManyToOne(() => User, (user:any) => user.Order_ID)
  User!: User;
}
