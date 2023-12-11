import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity('tb_admingroups')
export class AdminGroup extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    Admin_Group_ID!: string;

    @Column()
    Admin_Group_Name!: string;

    @Column()
    Menu_Access_ID!: string;

    @Column()
    Admin_Type!: string

    @Column({ type: 'date', default: new Date() })
    Date_Created!: Date;

    @OneToOne((type) => User, (user:any) => user.Admin_ID)
    user!: User;
}
