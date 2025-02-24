import { Entity, Column, PrimaryColumn, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('users')
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    last_name: string;

    @Column({nullable: true})
    role_id?: number;

    @CreateDateColumn({ type: 'timestamptz' , default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @ManyToOne(() => Role, (role) => role.users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.user)    
    vehicles: Vehicle[];
}
