import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('attendance')
export class Attendance {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Index()
  @Column()
  date: Date; // Work date

  @Column({ nullable: true })
  checkIn?: Date;

  @Column({ nullable: true })
  checkOut?: Date;

  @Column({ nullable: true })
  totalHours?: number; // Computed in hours

  @Column({ nullable: true })
  shiftId?: string; // Reference to Shift by id string

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  constructor() {
    this.createdAt = new Date();
  }
}