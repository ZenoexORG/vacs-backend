import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,  
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VehicleType } from 'src/modules/vehicle_types/entities/vehicle-type.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  id: string;

  @Column()
  type_id: number;

  @Column({ nullable: true })
  owner_id?: string;

  @Column({ nullable: true })
  soat?: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.vehicles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'owner_id' })
  user: User;

  @OneToOne(() => VehicleType, (vehicleType) => vehicleType.vehicle)
  @JoinColumn({ name: 'type_id' })
  type: VehicleType;
}
