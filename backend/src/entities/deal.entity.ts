import { Entity, ObjectIdColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';

@Entity('deals')
export class Deal {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ default: 'prospecting' })
  stage: string; // prospecting, qualification, proposal, negotiation, closed-won, closed-lost

  @Column({ type: 'int', default: 50 })
  probability: number;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCloseDate: Date;

  @ManyToOne(() => Contact, { nullable: true })
  contact: Contact;

  @Column({ nullable: true })
  contactId: ObjectId;

  @ManyToOne(() => Lead, { nullable: true })
  lead: Lead;

  @Column({ nullable: true })
  leadId: ObjectId;

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