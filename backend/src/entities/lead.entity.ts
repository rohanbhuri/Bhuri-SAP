import { Entity, ObjectIdColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Contact } from './contact.entity';

@Entity('leads')
export class Lead {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'new' })
  status: string; // new, qualified, contacted, converted, lost

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedValue: number;

  @Column({ nullable: true })
  source: string;

  @Column({ type: 'date', nullable: true })
  expectedCloseDate: Date;

  @ManyToOne(() => Contact, { nullable: true })
  contact: Contact;

  @Column({ nullable: true })
  contactId: ObjectId;

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