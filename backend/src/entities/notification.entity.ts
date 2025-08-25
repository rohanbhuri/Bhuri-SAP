import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export type NotificationType = 'message' | 'module_request' | 'module_approved' | 'module_rejected' | 'system';

export interface NotificationData {
  messageId?: ObjectId;
  conversationId?: ObjectId;
  senderId?: ObjectId;
  senderName?: string;
  organizationId?: ObjectId;
  requestId?: ObjectId;
  moduleId?: ObjectId;
  [key: string]: any;
}

@Entity('notifications')
export class Notification {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  userId: ObjectId;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'json', nullable: true })
  data?: NotificationData;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}