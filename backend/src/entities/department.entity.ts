import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('departments')
export class Department {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: String })
  managerId: ObjectId;

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}