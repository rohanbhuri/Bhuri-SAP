import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('project_milestones')
export class ProjectMilestone {
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

  // Timeline
  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  completedDate: Date;

  // Status & Progress
  @Column()
  status: string; // pending, in-progress, completed, overdue

  @Column({ default: 0 })
  progress: number;

  // Dependencies
  @Column('array')
  deliverableIds: ObjectId[];

  @Column('array')
  taskIds: ObjectId[];

  // Billing
  @Column({ default: false })
  billingMilestone: boolean;

  @Column({ nullable: true })
  billingAmount: number;

  @Column({ default: false })
  invoiced: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = 'pending';
    this.progress = 0;
    this.deliverableIds = [];
    this.taskIds = [];
    this.billingMilestone = false;
    this.invoiced = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}