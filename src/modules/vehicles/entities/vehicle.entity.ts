import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,  
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VehicleClass } from '../../vehicle_classes/entities/vehicle-class.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  id: string;

  @Column()
  class_id: number;

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

  @OneToOne(() => VehicleClass, (vehicleClass) => vehicleClass.vehicle)
  @JoinColumn({ name: 'class_id' })
  class: VehicleClass;
}
