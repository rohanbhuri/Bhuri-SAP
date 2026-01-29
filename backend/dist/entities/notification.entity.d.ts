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
export declare class Notification {
    _id: ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    userId: ObjectId;
    isRead: boolean;
    data?: NotificationData;
    createdAt: Date;
    updatedAt: Date;
}
