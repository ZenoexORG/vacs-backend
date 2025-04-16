import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('daily_reports')
export class DailyReport {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'date', unique: true})
    report_date: Date;

    @Column({type: 'int', default: 0})
    total_entries: number;

    @Column({type: 'int', default: 0})
    total_exits: number;

    @Column({type: 'int', default: 0})
    total_incidents: number;

    @Column({type: 'int', default: 0})
    active_vehicles: number;

    @Column({type: 'jsonb', default: '{}'})
    entries_by_hour: Record<string, number>;

    @Column({type: 'jsonb', default: '{}'})
    exits_by_hour: Record<string, number>;

    @Column({type: 'jsonb', default: '{}'})
    incidents_by_hour: Record<string, number>;

    @Column({type: 'jsonb', default: '{}'})
    entries_by_class: Record<string, number>;

    @Column({type: 'jsonb', default: '{}'})
    incidents_by_class: Record<string, number>;

    @Column({type: 'float', default: 0})
    average_time: number;

    @CreateDateColumn({type: 'timestamp'})
    generated_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;
}