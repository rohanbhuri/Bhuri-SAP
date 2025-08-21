import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('project_invoices')
export class ProjectInvoice {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  @Column({ type: String })
  clientId: ObjectId;

  // Invoice Details
  @Column()
  invoiceNumber: string;

  @Column()
  invoiceDate: Date;

  @Column()
  dueDate: Date;

  // Billing Items
  @Column('simple-json')
  items: {
    type: string; // timesheet, milestone, fixed
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    timesheetEntryIds?: ObjectId[];
    milestoneId?: ObjectId;
  }[];

  // Totals
  @Column()
  subtotal: number;

  @Column()
  tax: number;

  @Column()
  total: number;

  // Status
  @Column()
  status: string; // draft, sent, paid, overdue, cancelled

  @Column({ nullable: true })
  paidDate: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.tax = 0;
    this.total = 0;
    this.status = 'draft';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}