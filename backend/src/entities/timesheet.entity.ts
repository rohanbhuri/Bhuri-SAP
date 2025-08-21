import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('timesheet_entries')
export class TimesheetEntry {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  // User & Project
  @Column({ type: String })
  employeeId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  @Column({ type: String, nullable: true })
  taskId: ObjectId;

  @Column({ type: String, nullable: true })
  deliverableId: ObjectId;

  // Time Details
  @Column()
  date: Date;

  @Column({ nullable: true })
  startTime: string; // HH:MM format

  @Column({ nullable: true })
  endTime: string;

  @Column()
  totalHours: number;

  // Description & Category
  @Column()
  description: string;

  @Column({ nullable: true })
  workType: string; // development, design, testing, meeting, research

  // Status & Approval
  @Column()
  status: string; // draft, submitted, approved, rejected

  @Column({ type: String, nullable: true })
  approvedBy: ObjectId;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  // Billing
  @Column({ default: true })
  billable: boolean;

  @Column({ nullable: true })
  hourlyRate: number;

  @Column({ nullable: true })
  billingAmount: number;

  @Column({ default: false })
  invoiced: boolean;

  @Column({ type: String, nullable: true })
  invoiceId: ObjectId;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = 'draft';
    this.billable = true;
    this.invoiced = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

// Keep the old Timesheet entity for backward compatibility
@Entity('timesheets')
export class Timesheet {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  employeeId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  @Column()
  date: Date;

  @Column()
  hoursWorked: number;

  @Column()
  description: string;

  @Column()
  status: string; // draft, submitted, approved, rejected

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'draft';
    this.createdAt = new Date();
  }
}