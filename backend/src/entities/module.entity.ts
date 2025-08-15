import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Module {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column()
  isAvailable: boolean;

  @Column()
  createdAt: Date;

  constructor() {
    this.isAvailable = true;
    this.createdAt = new Date();
  }
}