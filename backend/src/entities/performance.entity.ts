import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

export type ReviewCycleStatus = 'draft' | 'active' | 'closed';

@Entity('goals')
export class Goal {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  progress: number; // 0-100

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.progress = 0;
    this.createdAt = new Date();
  }
}

@Entity('review-cycles')
export class ReviewCycle {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string; // e.g., FY 2025 H1

  @Column({ default: 'draft' })
  status: ReviewCycleStatus;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Index()
  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'draft';
    this.createdAt = new Date();
  }
}

@Entity('feedback')
export class Feedback {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  reviewCycleId: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId; // subject of feedback

  @Index()
  @Column({ type: String })
  reviewerId: ObjectId; // peer/manager/self

  @Column()
  type: 'peer' | 'manager' | 'self';

  @Column()
  rating: number; // 1-5

  @Column({ nullable: true })
  comments?: string;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}