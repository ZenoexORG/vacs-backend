import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { KindIdentification, Gender } from 'src/shared/enums';
import * as bcrypt from 'bcrypt';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: KindIdentification,
    default: KindIdentification.CC,
  })
  kind_id: KindIdentification;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.O })
  gender: string;

  @Column({ nullable: true })
  role_id?: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password.toString());
  }
}
