import { Entity, ObjectIdColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Lead } from './lead.entity';
import { Deal } from './deal.entity';
import { Task } from './task.entity';

@Entity('contacts')
export class Contact {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  position: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: ObjectId;

  @ManyToOne(() => User)
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: ObjectId;

  @OneToMany(() => Lead, lead => lead.contact)
  leads: Lead[];

  @OneToMany(() => Deal, deal => deal.contact)
  deals: Deal[];

  @OneToMany(() => Task, task => task.contact)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}