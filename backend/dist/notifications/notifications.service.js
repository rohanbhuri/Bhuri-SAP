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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const messages_gateway_1 = require("../messages/messages.gateway");
function isValidObjectId(id) {
    if (id instanceof mongodb_1.ObjectId)
        return true;
    if (typeof id !== 'string')
        return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
}
function safeObjectId(id) {
    try {
        if (id instanceof mongodb_1.ObjectId)
            return id;
        if (!isValidObjectId(id))
            return null;
        return new mongodb_1.ObjectId(id);
    }
    catch {
        return null;
    }
}
let NotificationsService = class NotificationsService {
    constructor(notificationRepo, userRepo, gateway) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.gateway = gateway;
    }
    async createNotification(userId, type, title, message, data) {
        const notification = this.notificationRepo.create({
            userId: new mongodb_1.ObjectId(userId),
            type,
            title,
            message,
            data,
            isRead: false,
            createdAt: new Date(),
        });
        const saved = await this.notificationRepo.save(notification);
        try {
            this.gateway.emitNotification({ userId: String(userId) }, {
                notification: saved,
                type: type
            });
            const unreadCount = await this.getUnreadCount(userId);
            this.gateway.server.to(`user:${userId}`).emit('notification:count', { count: unreadCount });
        }
        catch (error) {
            console.error('Failed to emit real-time notification:', error);
        }
        return saved;
    }
    async createMessageNotification(recipientId, senderId, senderName, conversationId, messageId, messageContent, organizationId) {
        if (String(recipientId) === String(senderId)) {
            return null;
        }
        const title = `New message from ${senderName}`;
        const message = messageContent.length > 100
            ? `${messageContent.substring(0, 100)}...`
            : messageContent;
        const data = {
            messageId: new mongodb_1.ObjectId(messageId),
            conversationId: new mongodb_1.ObjectId(conversationId),
            senderId: new mongodb_1.ObjectId(senderId),
            senderName,
        };
        if (organizationId) {
            data.organizationId = new mongodb_1.ObjectId(organizationId);
        }
        return this.createNotification(recipientId, 'message', title, message, data);
    }
    async getUserNotifications(userId, limit = 50, skip = 0, unreadOnly = false) {
        const userObjectId = new mongodb_1.ObjectId(userId);
        const query = { userId: userObjectId };
        if (unreadOnly) {
            query.isRead = false;
        }
        console.log('getUserNotifications query:', {
            userId: userObjectId.toString(),
            limit,
            skip,
            unreadOnly,
            query
        });
        const results = await this.notificationRepo.find({
            where: query,
            order: { createdAt: -1 },
            take: limit,
            skip,
        });
        console.log('getUserNotifications results count:', results.length);
        if (results.length > 0) {
            console.log('Sample notification userId:', results[0].userId.toString());
        }
        const total = await this.notificationRepo.count({});
        console.log('Total notifications in DB:', total);
        return results;
    }
    async getUnreadCount(userId) {
        return this.notificationRepo.count({
            where: {
                userId: new mongodb_1.ObjectId(userId),
                isRead: false,
            },
        });
    }
    async markAsRead(notificationId) {
        const notification = await this.notificationRepo.findOne({
            where: { _id: new mongodb_1.ObjectId(notificationId) },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.isRead = true;
        notification.updatedAt = new Date();
        return this.notificationRepo.save(notification);
    }
    async markAllAsRead(userId) {
        const result = await this.notificationRepo.updateMany({ userId: new mongodb_1.ObjectId(userId), isRead: false }, { $set: { isRead: true, updatedAt: new Date() } });
        return { modifiedCount: result.modifiedCount || 0 };
    }
    async deleteNotification(notificationId) {
        const result = await this.notificationRepo.deleteOne({
            _id: new mongodb_1.ObjectId(notificationId),
        });
        return result.deletedCount > 0;
    }
    async deleteOldNotifications(olderThanDays = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        const result = await this.notificationRepo.deleteMany({
            createdAt: { $lt: cutoffDate },
            isRead: true,
        });
        return { deletedCount: result.deletedCount || 0 };
    }
    async getNotificationsByType(userId, type, limit = 20) {
        return this.notificationRepo.find({
            where: {
                userId: new mongodb_1.ObjectId(userId),
                type,
            },
            order: { createdAt: -1 },
            take: limit,
        });
    }
    async getMessageNotifications(userId, conversationId) {
        const where = {
            userId: new mongodb_1.ObjectId(userId),
            type: 'message',
        };
        if (conversationId) {
            where['data.conversationId'] = new mongodb_1.ObjectId(conversationId);
        }
        return this.notificationRepo.find({
            where,
            order: { createdAt: -1 },
        });
    }
    async markConversationNotificationsAsRead(userId, conversationId) {
        const userObjectId = safeObjectId(userId);
        const conversationObjectId = safeObjectId(conversationId);
        if (!userObjectId) {
            throw new Error(`Invalid userId format: ${userId}`);
        }
        if (!conversationObjectId) {
            throw new Error(`Invalid conversationId format: ${conversationId}`);
        }
        const result = await this.notificationRepo.updateMany({
            userId: userObjectId,
            type: 'message',
            'data.conversationId': conversationObjectId,
            isRead: false,
        }, { $set: { isRead: true, updatedAt: new Date() } });
        return { modifiedCount: result.modifiedCount || 0 };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => messages_gateway_1.MessagesGateway))),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        messages_gateway_1.MessagesGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map