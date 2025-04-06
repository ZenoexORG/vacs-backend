import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicle_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  incident_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  solution_date: Date;

  @Column()
  comment: string;
}
