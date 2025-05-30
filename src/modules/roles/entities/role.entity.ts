import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: '#000000' })
  color: string;

  @OneToMany(() => Employee, (employee) => employee.role)
  employees?: Employee[];

  @OneToMany(() => User, (user) => user.role)
  users?: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions?: Permission[];
}
