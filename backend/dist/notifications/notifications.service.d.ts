import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Notification, NotificationType, NotificationData } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { MessagesGateway } from '../messages/messages.gateway';
export declare class NotificationsService {
    private notificationRepo;
    private userRepo;
    private gateway;
    constructor(notificationRepo: MongoRepository<Notification>, userRepo: MongoRepository<User>, gateway: MessagesGateway);
    createNotification(userId: string | ObjectId, type: NotificationType, title: string, message: string, data?: NotificationData): Promise<Notification>;
    createMessageNotification(recipientId: string | ObjectId, senderId: string | ObjectId, senderName: string, conversationId: string | ObjectId, messageId: string | ObjectId, messageContent: string, organizationId?: string | ObjectId): Promise<Notification>;
    getUserNotifications(userId: string | ObjectId, limit?: number, skip?: number, unreadOnly?: boolean): Promise<Notification[]>;
    getUnreadCount(userId: string | ObjectId): Promise<number>;
    markAsRead(notificationId: string | ObjectId): Promise<Notification>;
    markAllAsRead(userId: string | ObjectId): Promise<{
        modifiedCount: number;
    }>;
    deleteNotification(notificationId: string | ObjectId): Promise<boolean>;
    deleteOldNotifications(olderThanDays?: number): Promise<{
        deletedCount: number;
    }>;
    getNotificationsByType(userId: string | ObjectId, type: NotificationType, limit?: number): Promise<Notification[]>;
    getMessageNotifications(userId: string | ObjectId, conversationId?: string | ObjectId): Promise<Notification[]>;
    markConversationNotificationsAsRead(userId: string | ObjectId, conversationId: string | ObjectId): Promise<{
        modifiedCount: number;
    }>;
}
