import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum ClientRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED = 'CONVERTED'
}

@Entity('client_requests')
export class ClientRequest {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  companyName?: string;

  @Column()
  contactPerson: string;

  @Column({ unique: true })
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
  message?: string;

  @Column({ type: 'enum', enum: ClientRequestStatus, default: ClientRequestStatus.PENDING })
  status: ClientRequestStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  convertedUserId?: ObjectId;

  @Column({ nullable: true })
  convertedOrganizationId?: ObjectId;

  @Column({ nullable: true })
  reviewedBy?: ObjectId;

  @Column({ nullable: true })
  reviewedAt?: Date;

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
