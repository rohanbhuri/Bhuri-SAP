"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const conversation_entity_1 = require("../entities/conversation.entity");
const message_entity_1 = require("../entities/message.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let MessagesService = class MessagesService {
    constructor(conversationRepo, messageRepo, userRepo, organizationRepo, notificationsService) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.notificationsService = notificationsService;
    }
    async listOrganizationsWithMembers(userId) {
        const user = await this.userRepo.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
        const orgIds = user?.organizationIds || [];
        if (!orgIds.length)
            return [];
        const userObjectId = new mongodb_1.ObjectId(userId);
        const organizations = await this.organizationRepo.find({ where: { _id: { $in: orgIds } } });
        const members = await this.userRepo.find({ where: { organizationIds: { $in: orgIds } } });
        const grouped = orgIds.map((orgId) => {
            const org = organizations.find(o => o._id.toString() === orgId?.toString());
            return {
                organizationId: orgId,
                organizationName: org?.name || 'Unknown Organization',
                organizationCode: org?.code || '',
                members: members
                    .filter((m) => (m.organizationIds || []).some((id) => id?.toString() === orgId?.toString()) &&
                    m._id.toString() !== userObjectId.toString())
                    .map((m) => ({
                    id: m._id,
                    firstName: m.firstName,
                    lastName: m.lastName,
                    email: m.email,
                    isOnline: m.isOnline || false,
                    lastSeen: m.lastSeen,
                })),
            };
        });
        return grouped;
    }
    async getOrCreateDM(organizationId, userA, userB) {
        const org = new mongodb_1.ObjectId(organizationId);
        const a = new mongodb_1.ObjectId(userA);
        const b = new mongodb_1.ObjectId(userB);
        let convo = await this.conversationRepo.findOne({
            where: {
                organizationId: org,
                type: 'dm',
                memberIds: { $all: [a, b] },
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
    async createGroup(organizationId, name, memberIds) {
        const convo = this.conversationRepo.create({
            organizationId: new mongodb_1.ObjectId(organizationId),
            type: 'group',
            name,
            memberIds: memberIds.map((id) => new mongodb_1.ObjectId(id)),
            createdAt: new Date(),
            lastMessagePreview: [],
        });
        return this.conversationRepo.save(convo);
    }
    async listConversations(organizationId, userId) {
        const conversations = await this.conversationRepo.find({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                memberIds: { $in: [new mongodb_1.ObjectId(userId)] },
            },
            order: { createdAt: 'desc' },
        });
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
    async listMessages(conversationId, limit = 50, before) {
        const where = { conversationId: new mongodb_1.ObjectId(conversationId) };
        if (before)
            where._id = { $lt: new mongodb_1.ObjectId(before) };
        return this.messageRepo.find({
            where,
            order: { _id: 'DESC' },
            take: limit,
        });
    }
    async sendMessage(conversationId, senderId, content) {
        const message = this.messageRepo.create({
            conversationId: new mongodb_1.ObjectId(conversationId),
            senderId: new mongodb_1.ObjectId(senderId),
            content,
            readBy: [new mongodb_1.ObjectId(senderId)],
            createdAt: new Date(),
            organizationId: undefined,
        });
        const convo = await this.conversationRepo.findOne({ where: { _id: new mongodb_1.ObjectId(conversationId) } });
        if (convo)
            message.organizationId = convo.organizationId;
        const saved = await this.messageRepo.save(message);
        console.log(`Message saved with readBy:`, saved.readBy, 'for conversation:', conversationId);
        if (convo) {
            const preview = { senderId: message.senderId, content: content.slice(0, 120), at: new Date() };
            convo.lastMessagePreview = [preview];
            await this.conversationRepo.save(convo);
            await this.createMessageNotifications(convo, saved, senderId, content);
        }
        return saved;
    }
    async createMessageNotifications(conversation, message, senderId, content) {
        try {
            const sender = await this.userRepo.findOne({ where: { _id: new mongodb_1.ObjectId(senderId) } });
            const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'Someone';
            const recipientIds = conversation.memberIds.filter((memberId) => String(memberId) !== String(senderId));
            for (const recipientId of recipientIds) {
                await this.notificationsService.createMessageNotification(recipientId, senderId, senderName, conversation._id, message._id, content, conversation.organizationId);
            }
        }
        catch (error) {
            console.error('Failed to create message notifications:', error);
        }
    }
    async markAsRead(conversationId, userId) {
        const userObjectId = new mongodb_1.ObjectId(userId);
        const messages = await this.messageRepo.find({
            where: {
                conversationId: new mongodb_1.ObjectId(conversationId),
                readBy: { $nin: [userObjectId] },
            },
        });
        for (const message of messages) {
            message.readBy.push(userObjectId);
            await this.messageRepo.save(message);
        }
        await this.notificationsService.markConversationNotificationsAsRead(userId, conversationId);
        return { success: true, markedCount: messages.length };
    }
    async setTyping(conversationId, userId, isTyping) {
        return { success: true, conversationId, userId, isTyping };
    }
    async addReaction(messageId, userId, emoji) {
        const message = await this.messageRepo.findOne({ where: { _id: new mongodb_1.ObjectId(messageId) } });
        if (!message)
            throw new Error('Message not found');
        const reactions = message.reactions || [];
        const existingReaction = reactions.find((r) => r.userId.toString() === userId && r.emoji === emoji);
        if (!existingReaction) {
            reactions.push({ userId: new mongodb_1.ObjectId(userId), emoji, createdAt: new Date() });
            message.reactions = reactions;
            await this.messageRepo.save(message);
        }
        return message;
    }
    async removeReaction(messageId, userId, emoji) {
        const message = await this.messageRepo.findOne({ where: { _id: new mongodb_1.ObjectId(messageId) } });
        if (!message)
            throw new Error('Message not found');
        const reactions = message.reactions || [];
        message.reactions = reactions.filter((r) => !(r.userId.toString() === userId && r.emoji === emoji));
        await this.messageRepo.save(message);
        return message;
    }
    async searchMessages(userId, query, conversationId) {
        const where = {
            content: { $regex: query, $options: 'i' },
        };
        if (conversationId) {
            where.conversationId = new mongodb_1.ObjectId(conversationId);
        }
        else {
            const userConversations = await this.conversationRepo.find({
                where: { memberIds: { $in: [new mongodb_1.ObjectId(userId)] } },
            });
            const conversationIds = userConversations.map(c => c._id);
            where.conversationId = { $in: conversationIds };
        }
        return this.messageRepo.find({
            where,
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getUnreadMessageCount(userId) {
        const userObjectId = new mongodb_1.ObjectId(userId);
        const conversations = await this.conversationRepo.find({
            where: { memberIds: { $in: [userObjectId] } },
        });
        const unreadCounts = {};
        for (const conv of conversations) {
            const allMessages = await this.messageRepo.find({
                where: { conversationId: conv._id }
            });
            const unreadCount = allMessages.filter(msg => {
                const readByIds = (msg.readBy || []).map((id) => String(id));
                return !readByIds.includes(userId);
            }).length;
            console.log(`Unread count for user ${userId} in conversation ${conv._id}: ${unreadCount}`);
            unreadCounts[conv._id.toString()] = unreadCount;
        }
        console.log(`Total unread counts for user ${userId}:`, unreadCounts);
        return unreadCounts;
    }
    async getTotalUnreadCount(userId) {
        const counts = await this.getUnreadMessageCount(userId);
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        console.log(`getTotalUnreadCount for user ${userId}: individual counts:`, counts, 'total:', total);
        return total;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map