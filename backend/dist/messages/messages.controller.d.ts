import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
export declare class MessagesController {
    private readonly messagesService;
    private readonly messagesGateway;
    constructor(messagesService: MessagesService, messagesGateway: MessagesGateway);
    getOrganizationsWithMembers(req: any): Promise<{
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
    getOrCreateDM(req: any, organizationId: string, otherUserId: string): Promise<import("../entities/conversation.entity").Conversation>;
    createGroup(req: any, organizationId: string, body: {
        name: string;
        memberIds: string[];
    }): Promise<import("../entities/conversation.entity").Conversation[]>;
    listConversations(req: any, organizationId: string): Promise<any[]>;
    listMessages(conversationId: string, limit?: string, before?: string): Promise<import("../entities/message.entity").Message[]>;
    sendMessage(req: any, conversationId: string, body: {
        content: string;
    }): Promise<import("../entities/message.entity").Message[]>;
    markAsRead(req: any, conversationId: string): Promise<{
        success: boolean;
        markedCount: number;
    }>;
    setTyping(req: any, conversationId: string, body: {
        isTyping: boolean;
    }): Promise<{
        success: boolean;
        conversationId: string;
        userId: string;
        isTyping: boolean;
    }>;
    addReaction(req: any, messageId: string, body: {
        emoji: string;
    }): Promise<import("../entities/message.entity").Message>;
    removeReaction(req: any, messageId: string, emoji: string): Promise<import("../entities/message.entity").Message>;
    getUnreadCount(req: any): Promise<{
        [conversationId: string]: number;
    }>;
}
