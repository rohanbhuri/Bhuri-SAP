import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: MongoRepository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: MongoRepository<Message>,
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
    @InjectRepository(Organization)
    private organizationRepo: MongoRepository<Organization>,
  ) {}

  async listOrganizationsWithMembers(userId: string) {
    const user = await this.userRepo.findOne({ where: { _id: new ObjectId(userId) } });
    const orgIds = user?.organizationIds || [];
    if (!orgIds.length) return [];

    // Fetch organizations and members
    const organizations = await this.organizationRepo.find({ where: { _id: { $in: orgIds } } });
    const members = await this.userRepo.find({ where: { organizationIds: { $in: orgIds } } });
    
    const grouped = orgIds.map((orgId) => {
      const org = organizations.find(o => o._id.toString() === orgId?.toString());
      return {
        organizationId: orgId,
        organizationName: org?.name || 'Unknown Organization',
        organizationCode: org?.code || '',
        members: members
          .filter((m) => (m.organizationIds || []).some((id) => id?.toString() === orgId?.toString()))
          .map((m) => ({
            id: m._id,
            firstName: m.firstName,
            lastName: m.lastName,
            email: m.email,
          })),
      };
    });
    return grouped;
  }

  async getOrCreateDM(organizationId: string, userA: string, userB: string) {
    const org = new ObjectId(organizationId);
    const a = new ObjectId(userA);
    const b = new ObjectId(userB);
    let convo = await this.conversationRepo.findOne({
      where: {
        organizationId: org,
        type: 'dm' as any,
        memberIds: { $all: [a, b] } as any,
      },
    });
    if (!convo) {
      const created = this.conversationRepo.create({
        organizationId: org,
        type: 'dm',
        memberIds: [a, b],
        createdAt: new Date(),
        lastMessagePreview: [],
      });
      convo = await this.conversationRepo.save(created);
    }
    return convo;
  }

  async createGroup(organizationId: string, name: string, memberIds: string[]) {
    const convo = this.conversationRepo.create({
      organizationId: new ObjectId(organizationId),
      type: 'group',
      name,
      memberIds: memberIds.map((id) => new ObjectId(id)),
      createdAt: new Date(),
      lastMessagePreview: [],
    } as any);
    return this.conversationRepo.save(convo);
  }

  async listConversations(organizationId: string, userId: string) {
    return this.conversationRepo.find({
      where: {
        organizationId: new ObjectId(organizationId),
        memberIds: { $in: [new ObjectId(userId)] } as any,
      },
      order: { createdAt: 'desc' } as any,
    });
  }

  async listMessages(conversationId: string, limit = 50, before?: string) {
    const where: any = { conversationId: new ObjectId(conversationId) };
    if (before) where._id = { $lt: new ObjectId(before) };
    return this.messageRepo.find({
      where,
      order: { _id: 'DESC' } as any,
      take: limit,
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const message = this.messageRepo.create({
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(senderId),
      content,
      readBy: [new ObjectId(senderId)],
      createdAt: new Date(),
      organizationId: undefined as any,
    } as any);

    // set organizationId from conversation
    const convo = await this.conversationRepo.findOne({ where: { _id: new ObjectId(conversationId) } });
    if (convo) (message as any).organizationId = convo.organizationId;

    const saved = await this.messageRepo.save(message);

    if (convo) {
      const preview = { senderId: (message as any).senderId, content: content.slice(0, 120), at: new Date() } as any;
      (convo as any).lastMessagePreview = [preview];
      await this.conversationRepo.save(convo);
    }

    return saved;
  }
}