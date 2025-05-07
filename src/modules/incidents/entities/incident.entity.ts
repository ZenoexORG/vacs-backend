import { IncidentMessage } from 'src/modules/incident_messages/entities/incident_messages.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany
} from 'typeorm';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicle_id: string;

  @Column({ type: 'timestamptz' })
  incident_date: Date;

  @Column({ type: 'varchar', length: 20 })
  priority: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @OneToMany(() => IncidentMessage, (incidentMessage) => incidentMessage.incident)
  @JoinColumn({ name: 'incident_id' })
  incident_messages: IncidentMessage[];
}
