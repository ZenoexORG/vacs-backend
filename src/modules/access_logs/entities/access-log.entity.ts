import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm';

@Entity('access_logs')
export class AccessLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    entry_date: Date;

    @Column({ type: 'timestamp', nullable: true })
    exit_date: Date | null;

    @Column()
    vehicle_id: string;    
}
