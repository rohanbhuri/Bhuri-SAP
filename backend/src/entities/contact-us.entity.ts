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

  @Column()
  createdAt: Date;

  constructor() {
    this.isRead = false;
    this.createdAt = new Date();
  }
}
