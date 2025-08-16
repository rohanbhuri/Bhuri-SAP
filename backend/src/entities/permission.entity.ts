import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum ActionType {
  READ = 'read',
  WRITE = 'write',
  EDIT = 'edit',
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

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}