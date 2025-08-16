import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('organization_requests')
export class OrganizationRequest {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  userId: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING
  })
  status: RequestStatus;

  @Column()
  requestedAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @Column({ type: String, nullable: true })
  processedBy?: ObjectId;

  @Column({ nullable: true })
  reason?: string;

  constructor() {
    this.requestedAt = new Date();
    this.status = RequestStatus.PENDING;
  }
}