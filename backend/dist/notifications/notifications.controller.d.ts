import { NotificationsService } from './notifications.service';
import { NotificationType } from '../entities/notification.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, limit?: string, skip?: string, unreadOnly?: string, type?: NotificationType): Promise<import("../entities/notification.entity").Notification[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    getMessageNotifications(req: any, conversationId?: string): Promise<import("../entities/notification.entity").Notification[]>;
    markAsRead(id: string): Promise<{
        success: boolean;
        notification: import("../entities/notification.entity").Notification;
    }>;
    markAllAsRead(req: any): Promise<{
        modifiedCount: number;
        success: boolean;
    }>;
    markConversationAsRead(req: any, conversationId: string): Promise<{
        modifiedCount: number;
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        modifiedCount: number;
    }>;
    deleteNotification(id: string): Promise<{
        success: boolean;
    }>;
    cleanupOldNotifications(days?: string): Promise<{
        deletedCount: number;
        success: boolean;
    }>;
}
