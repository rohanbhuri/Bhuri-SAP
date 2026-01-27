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

  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: '₹' })
  currencySymbol: string;

  @Column()
  isActive: boolean;

  @Column('array')
  organizationIds: ObjectId[];

  @Column({ type: String, nullable: true })
  organizationId?: ObjectId;

  @Column('array')
  roleIds: ObjectId[];

  @Column('array')
  activeModuleIds: ObjectId[];

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  lastSeen?: Date;

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

  @Column('array')
  activeDevices: { deviceId: string; lastActive: Date; userAgent?: string }[];

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

  @Column()
  createdAt: Date;

  constructor() {
    this.isActive = true;
    this.organizationIds = [];
    this.roleIds = [];
    this.activeDevices = [];
    this.createdAt = new Date();
    this.isOnline = false;
  }
}