import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('organizations')
export class Organization {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column('array')
  activeModuleIds: ObjectId[];

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.activeModuleIds = [];
  }
}