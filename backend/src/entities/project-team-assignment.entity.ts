import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('project_team_assignments')
export class ProjectTeamAssignment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  @Column({ type: String })
  userId: ObjectId;

  @Column()
  role: string; // manager, developer, designer, tester, client

  // Assignment Details
  @Column({ type: String })
  assignedBy: ObjectId;

  @Column()
  assignedDate: Date;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  // Permissions
  @Column('array')
  permissions: string[]; // view, edit, manage, approve

  // Status
  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  constructor() {
    this.permissions = ['view'];
    this.isActive = true;
    this.createdAt = new Date();
  }
}