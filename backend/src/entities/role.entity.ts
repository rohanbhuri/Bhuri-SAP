import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CLIENT = 'client',
  CUSTOM = 'custom'
}

@Entity('roles')
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

  @Column({ default: 0 })
  hierarchyLevel: number;

  @Column()
  createdAt: Date;

  constructor() {
    this.permissionIds = [];
    this.hierarchyLevel = 0;
    this.createdAt = new Date();
  }
}