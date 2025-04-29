import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,  
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { KindIdentification, Gender } from 'src/shared/enums';
import { Role } from '../../roles/entities/role.entity';

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
  role_id?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;  

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
