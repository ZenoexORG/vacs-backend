import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { KindIdentification, Gender } from 'src/shared/enums';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: KindIdentification,
    default: KindIdentification.CC,
  })
  kind_id: KindIdentification;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.O })
  gender: Gender;

  @Column({ nullable: true })
  role_id?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];
}
