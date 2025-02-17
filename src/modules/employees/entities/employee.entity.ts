import { Entity, Column, PrimaryColumn, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Entity('employees')
export class Employee {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    last_name: string;

    @Column({nullable: true})
    role_id?: number;

    @Column({unique: true})
    username: string;

    @Column({type: 'bytea'})
    password: Buffer;

    @ManyToOne(() => Role, (role) => role.employees, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = Buffer.from(await bcrypt.hash(this.password.toString(), salt));
        }
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password.toString());
    }
}