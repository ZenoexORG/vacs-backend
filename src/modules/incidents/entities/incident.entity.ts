import { IncidentMessage } from 'src/modules/incident_messages/entities/incident_messages.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { AccessLog } from '../../access_logs/entities/access-log.entity';
import { IncidentStatus } from 'src/shared/enums/incidentStatus.enum';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  access_log_id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'varchar', length: 20 })
  priority: string;

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @OneToMany(() => IncidentMessage, (incidentMessage) => incidentMessage.incident)
  @JoinColumn({ name: 'incident_id' })
  incident_messages: IncidentMessage[];

  @ManyToOne(() => AccessLog, (accessLog) => accessLog.incidents, { nullable: false })
  @JoinColumn({ name: 'access_log_id' })
  access_log: AccessLog;
}
