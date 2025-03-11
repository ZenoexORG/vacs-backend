import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('incidents')
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vehicle_id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    incident_date: Date;

    @Column()
    solution_date: Date;

    @Column()
    comment: string;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.incidents, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;
}
