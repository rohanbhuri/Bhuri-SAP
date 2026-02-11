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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const messages_service_1 = require("./messages.service");
const messages_gateway_1 = require("./messages.gateway");
let MessagesController = class MessagesController {
    constructor(messagesService, messagesGateway) {
        this.messagesService = messagesService;
        this.messagesGateway = messagesGateway;
    }
    async getOrganizationsWithMembers(req) {
        return this.messagesService.listOrganizationsWithMembers(req.user.userId);
    }
    async getOrCreateDM(req, organizationId, otherUserId) {
        if (req.user.userId === otherUserId) {
            throw new Error('Cannot create DM with yourself');
        }
        return this.messagesService.getOrCreateDM(organizationId, req.user.userId, otherUserId);
    }
    async createGroup(req, organizationId, body) {
        const memberIds = [...(body.memberIds || []), req.user.userId];
        return this.messagesService.createGroup(organizationId, body.name, memberIds);
    }
    async listConversations(req, organizationId) {
        return this.messagesService.listConversations(organizationId, req.user.userId);
    }
    async listMessages(conversationId, limit, before) {
        return this.messagesService.listMessages(conversationId, limit ? Number(limit) : 50, before);
    }
    async sendMessage(req, conversationId, body) {
        const message = await this.messagesService.sendMessage(conversationId, req.user.userId, body.content);
        console.log(`📤 Broadcasting message to conversation:${conversationId}`, {
            messageId: message._id,
            senderId: req.user.userId,
            content: body.content.substring(0, 50)
        });
        this.messagesGateway.server.to(`conversation:${conversationId}`).emit('message:new', message);
        this.messagesGateway.server.to(`user:${req.user.userId}`).emit('message:new', message);
        const conversation = await this.messagesService['conversationRepo'].findOne({
            where: { _id: new (require('mongodb').ObjectId)(conversationId) }
        });
        if (conversation) {
            const allMemberIds = conversation.memberIds;
            for (const memberId of allMemberIds) {
                const unreadCounts = await this.messagesService.getUnreadMessageCount(String(memberId));
                const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
                const unreadConversations = Object.values(unreadCounts).filter(count => count > 0).length;
                console.log(`📊 Emitting counts to user:${memberId} - messages: ${totalUnread}, conversations: ${unreadConversations}`);
                this.messagesGateway.server.to(`user:${memberId}`).emit('message:count', { count: totalUnread });
                this.messagesGateway.server.to(`user:${memberId}`).emit('conversation:count', { count: unreadConversations });
            }
        }
        return message;
    }
    async markAsRead(req, conversationId) {
        return this.messagesService.markAsRead(conversationId, req.user.userId);
    }
    async setTyping(req, conversationId, body) {
        return this.messagesService.setTyping(conversationId, req.user.userId, body.isTyping);
    }
    async addReaction(req, messageId, body) {
        return this.messagesService.addReaction(messageId, req.user.userId, body.emoji);
    }
    async removeReaction(req, messageId, emoji) {
        return this.messagesService.removeReaction(messageId, req.user.userId, emoji);
    }
    async getUnreadCount(req) {
        return this.messagesService.getUnreadMessageCount(req.user.userId);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)('org-members'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getOrganizationsWithMembers", null);
__decorate([
    (0, common_1.Post)('dm/:organizationId/:otherUserId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('organizationId')),
    __param(2, (0, common_1.Param)('otherUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getOrCreateDM", null);
__decorate([
    (0, common_1.Post)('group/:organizationId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('organizationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('conversations/:organizationId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "listConversations", null);
__decorate([
    (0, common_1.Get)('chat/:conversationId'),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('before')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Post)('chat/:conversationId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('chat/:conversationId/read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('chat/:conversationId/typing'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "setTyping", null);
__decorate([
    (0, common_1.Post)(':messageId/reactions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Delete)(':messageId/reactions/:emoji'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Param)('emoji')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "removeReaction", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUnreadCount", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        messages_gateway_1.MessagesGateway])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map