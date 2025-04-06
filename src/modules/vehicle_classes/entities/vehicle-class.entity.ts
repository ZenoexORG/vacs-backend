import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('vehicle_classes')
export class VehicleClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.class)
  vehicle: Vehicle;
}
