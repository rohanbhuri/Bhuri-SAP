import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('compliance-items')
export class ComplianceItem {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string; // e.g., PF, ESIC, TDS Filing

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  active: boolean;

  @Index()
  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.active = true;
    this.createdAt = new Date();
  }
}

@Entity('compliance-events')
export class ComplianceEvent {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  itemId: ObjectId;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'overdue';

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'pending';
    this.createdAt = new Date();
  }
}

@Entity('audit-logs')
export class AuditLog {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  userId: ObjectId;

  @Column()
  action: string; // e.g., CREATE_PAYROLL, APPROVE_LEAVE

  @Column({ nullable: true })
  entity?: string; // collection/entity name

  @Column({ nullable: true })
  entityId?: string; // id of impacted entity

  @Column()
  timestamp: Date;

  @Column({ type: String })
  organizationId: ObjectId;

  constructor() {
    this.timestamp = new Date();
  }
}