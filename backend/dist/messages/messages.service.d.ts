import { MongoRepository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MessagesService {
    private conversationRepo;
    private messageRepo;
    private userRepo;
    private organizationRepo;
    private notificationsService;
    constructor(conversationRepo: MongoRepository<Conversation>, messageRepo: MongoRepository<Message>, userRepo: MongoRepository<User>, organizationRepo: MongoRepository<Organization>, notificationsService: NotificationsService);
    listOrganizationsWithMembers(userId: string): Promise<{
        organizationId: import("typeorm").ObjectId;
        organizationName: string;
        organizationCode: string;
        members: {
            id: import("typeorm").ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            isOnline: any;
            lastSeen: any;
        }[];
    }[]>;
    getOrCreateDM(organizationId: string, userA: string, userB: string): Promise<Conversation>;
    createGroup(organizationId: string, name: string, memberIds: string[]): Promise<Conversation[]>;
    listConversations(organizationId: string, userId: string): Promise<any[]>;
    listMessages(conversationId: string, limit?: number, before?: string): Promise<Message[]>;
    sendMessage(conversationId: string, senderId: string, content: string): Promise<Message[]>;
    private createMessageNotifications;
    markAsRead(conversationId: string, userId: string): Promise<{
        success: boolean;
        markedCount: number;
    }>;
    setTyping(conversationId: string, userId: string, isTyping: boolean): Promise<{
        success: boolean;
        conversationId: string;
        userId: string;
        isTyping: boolean;
    }>;
    addReaction(messageId: string, userId: string, emoji: string): Promise<Message>;
    removeReaction(messageId: string, userId: string, emoji: string): Promise<Message>;
    searchMessages(userId: string, query: string, conversationId?: string): Promise<Message[]>;
    getUnreadMessageCount(userId: string): Promise<{
        [conversationId: string]: number;
    }>;
    getTotalUnreadCount(userId: string): Promise<number>;
}
