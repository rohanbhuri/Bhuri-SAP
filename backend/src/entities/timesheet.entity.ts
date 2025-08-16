import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('timesheets')
export class Timesheet {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('objectId')
  employeeId: ObjectId;

  @Column('objectId')
  projectId: ObjectId;

  @Column()
  date: Date;

  @Column()
  hoursWorked: number;

  @Column()
  description: string;

  @Column()
  status: string; // draft, submitted, approved, rejected

  @Column('objectId')
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'draft';
    this.createdAt = new Date();
  }
}