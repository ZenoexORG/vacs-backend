import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('access_logs')
export class AccessLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    entry_date: Date;

    @Column({ type: 'timestamptz', nullable: true })
    exit_date: Date;

    @Column()
    vehicle_id: string;

    @ManyToOne(() => Vehicle, vehicle => vehicle.access_logs)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;
}