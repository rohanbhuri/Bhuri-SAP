import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum ModulePermissionType {
  PUBLIC = 'public',
  REQUIRE_PERMISSION = 'require_permission'
}

@Entity('modules')
export class Module {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @Column()
  permissionType: string;

  @Column()
  category: string;

  @Column()
  icon: string;

  @Column()
  color: string;

  @Column()
  createdAt: Date;

  constructor() {
    this.isActive = false;
    this.createdAt = new Date();
  }
}