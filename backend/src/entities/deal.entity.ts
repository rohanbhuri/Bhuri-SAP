import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
  contactId: string;

  @ManyToOne(() => Lead, { nullable: true })
  lead: Lead;

  @Column({ nullable: true })
  leadId: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: string;

  @ManyToOne(() => User)
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}