import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('messages')
export class Message {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column('objectid')
  conversationId: ObjectId; // Room/Conversation

  @Index()
  @Column('objectid')
  organizationId: ObjectId;

  @Index()
  @Column('objectid')
  senderId: ObjectId;

  @Column('text')
  content: string;

  @Column('array')
  readBy: ObjectId[];

  @Column({ type: 'array', nullable: true })
  reactions?: { userId: ObjectId; emoji: string; createdAt: Date }[];

  @Column('datetime')
  createdAt: Date;

  constructor() {
    this.readBy = [];
    this.reactions = [];
    this.createdAt = new Date();
  }
}