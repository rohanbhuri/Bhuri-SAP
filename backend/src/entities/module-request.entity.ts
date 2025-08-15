import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum ModuleRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity()
export class ModuleRequest {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('objectId')
  moduleId: ObjectId;

  @Column('objectId')
  userId: ObjectId;

  @Column('objectId')
  organizationId: ObjectId;

  @Column()
  status: ModuleRequestStatus;

  @Column()
  requestedAt: Date;

  @Column()
  processedAt?: Date;

  @Column('objectId')
  processedBy?: ObjectId;

  constructor() {
    this.status = ModuleRequestStatus.PENDING;
    this.requestedAt = new Date();
  }
}