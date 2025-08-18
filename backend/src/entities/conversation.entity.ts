import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

export type ConversationType = 'dm' | 'group';

@Entity('conversations')
export class Conversation {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column('objectid')
  organizationId: ObjectId;

  @Column('varchar')
  type: ConversationType; // dm or group

  @Column('array')
  memberIds: ObjectId[]; // participants

  @Column({ type: 'varchar', nullable: true })
  name?: string; // for groups

  @Column('array')
  lastMessagePreview: { senderId: ObjectId; content: string; at: Date }[];

  @Column('datetime')
  createdAt: Date;

  constructor() {
    this.memberIds = [];
    this.lastMessagePreview = [];
    this.createdAt = new Date();
  }
}