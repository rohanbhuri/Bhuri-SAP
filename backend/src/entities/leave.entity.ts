import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

@Entity('leaves')
export class LeaveRequest {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  leaveType: string; // e.g., CL, SL, PL

  @Column({ default: 'pending' })
  status: LeaveStatus;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approverId?: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.status = 'pending';
    this.createdAt = new Date();
  }
}