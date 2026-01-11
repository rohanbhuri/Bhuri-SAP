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

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: '$' })
  currencySymbol: string;

  @Column()
  isActive: boolean;

  @Column('array')
  organizationIds: ObjectId[];

  @Column({ type: String, nullable: true })
  organizationId?: ObjectId;

  @Column('array')
  roleIds: ObjectId[];



  @Column({ default: false })
  forcePasswordChange: boolean;

  @Column({ default: false })
  requireTwoFactor: boolean;

  @Column({ nullable: true })
  sessionTimeout?: number;

  @Column({ default: false })
  restrictToBusinessHours: boolean;

  @Column({ default: false })
  allowApiAccess: boolean;

  @Column({ nullable: true })
  expiryDate?: Date;

  @Column({ nullable: true })
  ipWhitelist?: string;

  @Column({ nullable: true })
  maxDevices?: number;

  @Column()
  createdAt: Date;

  constructor() {
    this.isActive = true;
    this.organizationIds = [];
    this.roleIds = [];
    this.createdAt = new Date();
  }
}