import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('holidays')
export class Holiday {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Index()
  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}