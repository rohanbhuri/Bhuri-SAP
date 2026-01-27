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

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ type: 'json', default: [] })
  changeLog: Array<{
    userId: string;
    action: string;
    timestamp: Date;
    details?: string;
  }>;

  constructor() {
    this.createdAt = new Date();
  }
}