import { Entity, Column, PrimaryColumn, JoinColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VehicleClass } from '../../vehicle_classes/entities/vehicle-class.entity';
import { Incident } from '../../incidents/entities/incident.entity';
import { AccessLog } from '../../access_logs/entities/access-log.entity';

@Entity('vehicles')
export class Vehicle {
    @PrimaryColumn()
    id: string;

    @Column()
    class_id: number;

    @Column({ nullable: true })
    user_id?: string;

    @Column({ nullable: true })
    soat?: string;

    @ManyToOne(() => User, (user) => user.vehicles, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => VehicleClass, (vehicleClass) => vehicleClass.vehicle)
    @JoinColumn({ name: 'class_id' })
    class: VehicleClass;
}
