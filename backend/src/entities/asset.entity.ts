import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('assets')
export class Asset {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ nullable: true })
  serialNumber?: string;

  @Column({ nullable: true })
  category?: string; // laptop, phone, etc.

  @Index()
  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}

@Entity('asset-assignments')
export class AssetAssignment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  assetId: ObjectId;

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column()
  assignedAt: Date;

  @Column({ nullable: true })
  returnedAt?: Date;

  @Column({ type: String })
  organizationId: ObjectId;

  constructor() {
    this.assignedAt = new Date();
  }
}