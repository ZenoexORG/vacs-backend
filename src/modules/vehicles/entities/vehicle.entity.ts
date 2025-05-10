import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VehicleType } from 'src/modules/vehicle_types/entities/vehicle-type.entity';
import { AccessLog } from 'src/modules/access_logs/entities/access-log.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn()
  id: string;

  @Column()
  type_id: number;

  @Column()
  owner_id: string;

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

  @OneToMany(() => AccessLog, (accessLog) => accessLog.vehicle, { nullable: true })
  access_logs: AccessLog[];
}