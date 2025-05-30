import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('vehicle_types')
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 15 })
  allowed_time: number;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.type)
  vehicle: Vehicle;
}
