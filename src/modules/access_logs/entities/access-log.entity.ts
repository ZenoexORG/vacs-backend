import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Incident } from '../../incidents/entities/incident.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_access_logs_entry_date')
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entry_date: Date;

  @Index('idx_access_logs_exit_date')
  @Column({ type: 'timestamp', nullable: true })
  exit_date: Date | null;

  @Index('idx_access_logs_entry_date_exit_date')
  @Column()
  vehicle_id: string;

  @Column()
  vehicle_type: string;

  @OneToMany(() => Incident, (incident) => incident.access_log, { nullable: true })
  incidents: Incident[];

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.access_logs, { nullable: true })
  @JoinColumn({ name: 'vehicle_id', referencedColumnName: 'id' })
  vehicle: Vehicle;
}
