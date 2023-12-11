import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('tb_permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  PermissionName!: string;

  @ManyToMany(() => User, (user) => user.Permissions)
  Users!: User[];
}
