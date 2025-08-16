import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('shifts')
export class Shift {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string; // e.g., General, Night

  @Column()
  startTime: string; // HH:mm

  @Column()
  endTime: string; // HH:mm

  @Column({ nullable: true })
  daysOfWeek?: number[]; // 0-6

  @Index()
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