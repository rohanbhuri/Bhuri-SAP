import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Notification, NotificationType, NotificationData } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

// Utility function to validate ObjectId format
function isValidObjectId(id: string | ObjectId): boolean {
  if (id instanceof ObjectId) return true;
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Utility function to safely create ObjectId
function safeObjectId(id: string | ObjectId): ObjectId | null {
  try {
    if (id instanceof ObjectId) return id;
    if (!isValidObjectId(id)) return null;
    return new ObjectId(id);
  } catch {
    return null;
  }
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: MongoRepository<Notification>,
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
  ) {}

  async createNotification(
    userId: string | ObjectId,
    type: NotificationType,
    title: string,
    message: string,
    data?: NotificationData
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId: new ObjectId(userId),
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date(),
    });

    return this.notificationRepo.save(notification);
  }

  async createMessageNotification(
    recipientId: string | ObjectId,
    senderId: string | ObjectId,
    senderName: string,
    conversationId: string | ObjectId,
    messageId: string | ObjectId,
    messageContent: string,
    organizationId?: string | ObjectId
  ): Promise<Notification> {
    // Don't create notification if sender is the same as recipient
    if (String(recipientId) === String(senderId)) {
      return null;
    }

    const title = `New message from ${senderName}`;
    const message = messageContent.length > 100 
      ? `${messageContent.substring(0, 100)}...` 
      : messageContent;

    const data: NotificationData = {
      messageId: new ObjectId(messageId),
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(senderId),
      senderName,
    };

    if (organizationId) {
      data.organizationId = new ObjectId(organizationId);
    }

    return this.createNotification(
      recipientId,
      'message',
      title,
      message,
      data
    );
  }

  async getUserNotifications(
    userId: string | ObjectId,
    limit = 50,
    skip = 0,
    unreadOnly = false
  ): Promise<Notification[]> {
    const where: any = { userId: new ObjectId(userId) };
    if (unreadOnly) {
      where.isRead = false;
    }

    return this.notificationRepo.find({
      where,
      order: { createdAt: 'DESC' } as any,
      take: limit,
      skip,
    });
  }

  async getUnreadCount(userId: string | ObjectId): Promise<number> {
    return this.notificationRepo.count({
      where: {
        userId: new ObjectId(userId),
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string | ObjectId): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { _id: new ObjectId(notificationId) },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    notification.updatedAt = new Date();
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string | ObjectId): Promise<{ modifiedCount: number }> {
    const result = await this.notificationRepo.updateMany(
      { userId: new ObjectId(userId), isRead: false },
      { $set: { isRead: true, updatedAt: new Date() } }
    );

    return { modifiedCount: result.modifiedCount || 0 };
  }

  async deleteNotification(notificationId: string | ObjectId): Promise<boolean> {
    const result = await this.notificationRepo.deleteOne({
      _id: new ObjectId(notificationId),
    });

    return result.deletedCount > 0;
  }

  async deleteOldNotifications(olderThanDays = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.notificationRepo.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    });

    return { deletedCount: result.deletedCount || 0 };
  }

  async getNotificationsByType(
    userId: string | ObjectId,
    type: NotificationType,
    limit = 20
  ): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: {
        userId: new ObjectId(userId),
        type,
      },
      order: { createdAt: 'DESC' } as any,
      take: limit,
    });
  }

  async getMessageNotifications(
    userId: string | ObjectId,
    conversationId?: string | ObjectId
  ): Promise<Notification[]> {
    const where: any = {
      userId: new ObjectId(userId),
      type: 'message',
    };

    if (conversationId) {
      where['data.conversationId'] = new ObjectId(conversationId);
    }

    return this.notificationRepo.find({
      where,
      order: { createdAt: 'DESC' } as any,
    });
  }

  async markConversationNotificationsAsRead(
    userId: string | ObjectId,
    conversationId: string | ObjectId
  ): Promise<{ modifiedCount: number }> {
    // Validate ObjectIds
    const userObjectId = safeObjectId(userId);
    const conversationObjectId = safeObjectId(conversationId);

    if (!userObjectId) {
      throw new Error(`Invalid userId format: ${userId}`);
    }

    if (!conversationObjectId) {
      throw new Error(`Invalid conversationId format: ${conversationId}`);
    }

    const result = await this.notificationRepo.updateMany(
      {
        userId: userObjectId,
        type: 'message',
        'data.conversationId': conversationObjectId,
        isRead: false,
      },
      { $set: { isRead: true, updatedAt: new Date() } }
    );

    return { modifiedCount: result.modifiedCount || 0 };
  }
}