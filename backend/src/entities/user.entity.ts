import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;

  @Column('objectId')
  organizationId: ObjectId;

  @Column('array')
  roleIds: ObjectId[];

  @Column('array')
  permissionIds: ObjectId[];

  @Column('array')
  activeModuleIds: ObjectId[];

  @Column()
  createdAt: Date;

  constructor() {
    this.isActive = true;
    this.roleIds = [];
    this.permissionIds = [];
    this.activeModuleIds = [];
    this.createdAt = new Date();
  }
}