import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => User, user => user.role)
    users?: User[];

    @OneToMany(() => Employee, employee => employee.role)
    employees?: Employee[];

    @ManyToMany(() => Permission, permission => permission.roles)
    permissions?: Permission[];
}

