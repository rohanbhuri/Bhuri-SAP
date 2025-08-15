import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOM = 'custom'
}

@Entity()
export class Role {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  type: RoleType;

  @Column()
  description: string;

  @Column('array')
  permissionIds: ObjectId[];

  @Column()
  createdAt: Date;

  constructor() {
    this.permissionIds = [];
    this.createdAt = new Date();
  }
}