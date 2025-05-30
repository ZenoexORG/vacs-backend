import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from 'typeorm';
import { Incident } from '../../incidents/entities/incident.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('incident_messages')
export class IncidentMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    incident_id: number;

    @Column('text')
    message: string;

    @Column()
    author_id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => Incident, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'incident_id' })
    incident: Incident;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: Employee;
}