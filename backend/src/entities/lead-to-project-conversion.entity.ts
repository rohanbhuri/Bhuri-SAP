import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('lead_to_project_conversions')
export class LeadToProjectConversion {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  leadId: ObjectId;

  @Column({ type: String })
  projectId: ObjectId;

  // Conversion Details
  @Column({ type: String })
  convertedBy: ObjectId;

  @Column()
  conversionDate: Date;

  @Column()
  conversionReason: string;

  // Mapping Data
  @Column()
  leadValue: number;

  @Column()
  projectBudget: number;

  @Column()
  estimatedDuration: number; // in days

  // Status
  @Column()
  status: string; // converted, active, completed

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'converted';
    this.createdAt = new Date();
  }
}