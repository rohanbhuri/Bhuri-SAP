import { Entity, ObjectIdColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';
import { Deal } from './deal.entity';

@Entity('tasks')
export class Task {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: string; // pending, in-progress, completed, cancelled

  @Column({ default: 'medium' })
  priority: string; // low, medium, high, urgent

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  reminderDate: Date;

  @Column({ default: 'task' })
  type: string; // task, call, email, meeting, follow-up

  @ManyToOne(() => Contact, { nullable: true })
  contact: Contact;

  @Column({ nullable: true })
  contactId: ObjectId;

  @ManyToOne(() => Lead, { nullable: true })
  lead: Lead;

  @Column({ nullable: true })
  leadId: ObjectId;

  @ManyToOne(() => Deal, { nullable: true })
  deal: Deal;

  @Column({ nullable: true })
  dealId: ObjectId;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: ObjectId;

  @ManyToOne(() => User)
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}