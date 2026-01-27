import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('clients')
export class Client {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column({ nullable: true })
  organizationId?: ObjectId;

  @Column()
  companyName: string;

  @Column()
  contactPerson: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  companySize?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  billingAddress?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  customFields?: Record<string, any>;

  // Security & Access Control
  @Column({ nullable: true })
  maxDevices?: number;

  @Column({ nullable: true })
  sessionTimeout?: number;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  ipWhitelist?: string;

  @Column({ default: false })
  requireTwoFactor: boolean;

  @Column({ default: false })
  forcePasswordChange: boolean;

  @Column({ default: false })
  restrictToBusinessHours: boolean;

  @Column({ default: false })
  allowApiAccess: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ type: 'json', default: [] })
  changeLog: Array<{
    userId: string;
    action: string;
    timestamp: Date;
    details?: string;
  }>;
}
