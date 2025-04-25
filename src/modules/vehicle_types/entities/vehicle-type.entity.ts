import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('vehicle_types')
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.type)
  vehicle: Vehicle;
}
