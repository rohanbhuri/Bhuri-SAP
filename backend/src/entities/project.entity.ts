import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('projects')
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String, nullable: true })
  organizationId?: ObjectId;

  @Column({ type: String })
  createdBy: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  code: string; // Auto-generated project code

  // Lead Conversion
  @Column({ type: String, nullable: true })
  leadId: ObjectId;

  @Column({ default: false })
  convertedFromLead: boolean;

  @Column({ nullable: true })
  conversionDate: Date;

  // Status & Pipeline
  @Column()
  status: string; // planning, active, on-hold, completed, cancelled

  @Column()
  stage: string; // discovery, planning, execution, delivery, closure

  @Column()
  priority: string; // low, medium, high, critical

  // Timeline
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  actualStartDate: Date;

  @Column({ nullable: true })
  actualEndDate: Date;

  // Financial
  @Column()
  budget: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: 0 })
  spent: number;

  @Column()
  billingType: string; // fixed, hourly, milestone

  @Column({ nullable: true })
  hourlyRate: number;

  // Team & Client
  @Column({ type: String, nullable: true })
  managerId?: ObjectId;

  @Column({ type: String, nullable: true })
  clientId: ObjectId;

  @Column('array')
  teamMemberIds: ObjectId[];

  // Progress Tracking
  @Column({ default: 0 })
  progress: number; // 0-100

  @Column({ default: 'green' })
  health: string; // green, yellow, red

  // Metadata
  @Column('array')
  tags: string[];

  @Column('simple-json')
  customFields: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.status = 'planning';
    this.stage = 'discovery';
    this.priority = 'medium';
    this.convertedFromLead = false;
    this.spent = 0;
    this.progress = 0;
    this.health = 'green';
    this.currency = 'USD';
    this.teamMemberIds = [];
    this.tags = [];
    this.customFields = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}