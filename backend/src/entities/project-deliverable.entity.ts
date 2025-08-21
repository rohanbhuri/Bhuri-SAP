import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('project_deliverables')
export class ProjectDeliverable {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: string; // document, software, design, report

  // Status & Progress
  @Column()
  status: string; // pending, in-progress, review, completed, rejected

  @Column({ default: 0 })
  progress: number;

  // Assignment
  @Column({ type: String, nullable: true })
  assignedTo: ObjectId;

  @Column({ type: String, nullable: true })
  reviewerId: ObjectId;

  // Timeline
  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  completedDate: Date;

  // Dependencies
  @Column('array')
  dependencies: ObjectId[];

  // Files & Links
  @Column('simple-json')
  attachments: {
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];

  // Billing
  @Column({ default: true })
  billable: boolean;

  @Column({ nullable: true })
  estimatedHours: number;

  @Column({ nullable: true })
  actualHours: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = 'pending';
    this.progress = 0;
    this.dependencies = [];
    this.attachments = [];
    this.billable = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}