import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('projects')
export class Project {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string; // planning, active, on-hold, completed, cancelled

  @Column()
  priority: string; // low, medium, high, critical

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  budget: number;

  @Column('array')
  teamMemberIds: ObjectId[];

  @Column({ type: String })
  managerId: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'planning';
    this.priority = 'medium';
    this.teamMemberIds = [];
    this.createdAt = new Date();
  }
}