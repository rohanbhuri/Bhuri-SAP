import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('organizations')
export class Organization {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  memberCount: number;

  @Column('array')
  activeModuleIds: ObjectId[];

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.activeModuleIds = [];
  }
}