import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

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