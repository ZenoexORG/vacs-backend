import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,  
  OneToMany,
} from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;  

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];
}
