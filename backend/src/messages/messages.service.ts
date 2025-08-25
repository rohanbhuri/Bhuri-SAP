import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { NotificationsService } from '../notifications/notifications.service';

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
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
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
    const conversations = await this.conversationRepo.find({
      where: {
        organizationId: new ObjectId(organizationId),
        memberIds: { $in: [new ObjectId(userId)] } as any,
      },
      order: { createdAt: 'desc' } as any,
    });

    // Populate conversation details with member info
    const populatedConversations = [];
    for (const conv of conversations) {
      const memberUsers = await this.userRepo.find({
        where: { _id: { $in: conv.memberIds } },
      });
      
      const conversationWithMembers = {
        ...conv,
        members: memberUsers.map(u => ({
          id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        })),
      };
      
      populatedConversations.push(conversationWithMembers);
    }

    return populatedConversations;
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

      // Create notifications for all conversation participants except sender
      await this.createMessageNotifications(convo, saved, senderId, content);
    }

    return saved;
  }

  private async createMessageNotifications(
    conversation: Conversation,
    message: any,
    senderId: string,
    content: string
  ) {
    try {
      // Get sender information
      const sender = await this.userRepo.findOne({ where: { _id: new ObjectId(senderId) } });
      const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'Someone';

      // Get all participants except the sender
      const recipientIds = (conversation as any).memberIds.filter(
        (memberId: ObjectId) => String(memberId) !== String(senderId)
      );

      // Create notifications for each recipient
      for (const recipientId of recipientIds) {
        await this.notificationsService.createMessageNotification(
          recipientId,
          senderId,
          senderName,
          conversation._id,
          message._id,
          content,
          (conversation as any).organizationId
        );
      }
    } catch (error) {
      console.error('Failed to create message notifications:', error);
      // Don't throw error to avoid breaking message sending
    }
  }

  async markAsRead(conversationId: string, userId: string) {
    const userObjectId = new ObjectId(userId);
    const messages = await this.messageRepo.find({
      where: {
        conversationId: new ObjectId(conversationId),
        readBy: { $nin: [userObjectId] } as any,
      },
    });

    for (const message of messages) {
      (message as any).readBy.push(userObjectId);
      await this.messageRepo.save(message);
    }

    return { success: true, markedCount: messages.length };
  }

  async setTyping(conversationId: string, userId: string, isTyping: boolean) {
    // In a real implementation, this would use WebSocket or Redis for real-time updates
    // For now, we'll just return success
    return { success: true, conversationId, userId, isTyping };
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.messageRepo.findOne({ where: { _id: new ObjectId(messageId) } });
    if (!message) throw new Error('Message not found');

    const reactions = (message as any).reactions || [];
    const existingReaction = reactions.find((r: any) => r.userId.toString() === userId && r.emoji === emoji);
    
    if (!existingReaction) {
      reactions.push({ userId: new ObjectId(userId), emoji, createdAt: new Date() });
      (message as any).reactions = reactions;
      await this.messageRepo.save(message);
    }

    return message;
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.messageRepo.findOne({ where: { _id: new ObjectId(messageId) } });
    if (!message) throw new Error('Message not found');

    const reactions = (message as any).reactions || [];
    (message as any).reactions = reactions.filter((r: any) => 
      !(r.userId.toString() === userId && r.emoji === emoji)
    );
    
    await this.messageRepo.save(message);
    return message;
  }

  async searchMessages(userId: string, query: string, conversationId?: string) {
    const where: any = {
      content: { $regex: query, $options: 'i' },
    };

    if (conversationId) {
      where.conversationId = new ObjectId(conversationId);
    } else {
      // Only search in conversations where user is a member
      const userConversations = await this.conversationRepo.find({
        where: { memberIds: { $in: [new ObjectId(userId)] } as any },
      });
      const conversationIds = userConversations.map(c => c._id);
      where.conversationId = { $in: conversationIds };
    }

    return this.messageRepo.find({
      where,
      order: { createdAt: 'DESC' } as any,
      take: 50,
    });
  }
}