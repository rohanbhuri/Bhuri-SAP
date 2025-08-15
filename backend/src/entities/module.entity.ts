import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export enum ModulePermissionType {
  PUBLIC = 'public',
  REQUIRE_PERMISSION = 'require_permission'
}

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
  permissionType: ModulePermissionType;

  @Column()
  createdAt: Date;

  constructor() {
    this.isAvailable = true;
    this.createdAt = new Date();
  }
}