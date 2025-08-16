import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

export type PayrollStatus = 'draft' | 'processed' | 'paid';

@Entity('salary-structures')
export class SalaryStructure {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column({ default: [] })
  earnings: { name: string; code?: string; amount: number; taxable?: boolean }[];

  @Column({ default: [] })
  deductions: { name: string; code?: string; amount: number }[];

  @Column({ default: [] })
  reimbursements: { name: string; code?: string; amount: number }[];

  @Column({ nullable: true })
  effectiveFrom?: Date;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.earnings = [];
    this.deductions = [];
    this.reimbursements = [];
    this.createdAt = new Date();
  }
}

@Entity('payroll-runs')
export class PayrollRun {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  month: number; // 1-12

  @Column()
  year: number; // YYYY

  @Column({ default: 'draft' })
  status: PayrollStatus;

  @Column({ default: [] })
  items: PayrollItem[];

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  constructor() {
    this.status = 'draft';
    this.items = [];
    this.createdAt = new Date();
  }
}

export class PayrollItem {
  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column()
  gross: number;

  @Column()
  deductions: number;

  @Column()
  net: number;

  @Column({ default: [] })
  components: { name: string; amount: number; type: 'earning' | 'deduction' | 'reimbursement' }[];

  @Column({ nullable: true })
  payslipUrl?: string; // Link to generated PDF stored elsewhere
}