import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum ActionType {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

@Entity('permissions')
export class Permission {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  module: string;

  @Column()
  action: ActionType;

  @Column()
  resource: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}