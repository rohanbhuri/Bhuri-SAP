import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('project_pipelines')
export class ProjectPipeline {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('simple-json')
  stages: {
    name: string;
    order: number;
    color: string;
    requirements: string[];
    autoTransition: boolean;
    transitionConditions: any;
  }[];

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  constructor() {
    this.stages = [];
    this.isDefault = false;
    this.isActive = true;
    this.createdAt = new Date();
  }
}