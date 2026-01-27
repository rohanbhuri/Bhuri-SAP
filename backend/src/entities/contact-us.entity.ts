import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('contact_us')
export class ContactUs {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  organizationId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt?: Date;

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
    this.isRead = false;
    this.createdAt = new Date();
  }
}
