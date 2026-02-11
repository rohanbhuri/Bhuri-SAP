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
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const messages_service_1 = require("./messages.service");
const notifications_service_1 = require("../notifications/notifications.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const user_entity_1 = require("../entities/user.entity");
let MessagesGateway = class MessagesGateway {
    constructor(messagesService, notificationsService, jwtService, userRepo) {
        this.messagesService = messagesService;
        this.notificationsService = notificationsService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }
    async handleConnection(client) {
        const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            console.log(`Client ${client.id} attempted connection without token, disconnecting`);
            client.disconnect();
            return;
        }
        try {
            const decoded = this.jwtService.verify(token);
            client.data.userId = decoded.sub || decoded.userId;
            client.data.user = decoded;
            client.join(`user:${client.data.userId}`);
            console.log(`Client ${client.id} connected with user: ${client.data.userId}`);
            await this.updateUserOnlineStatus(client.data.userId, true);
            const user = await this.userRepo.findOne({ where: { _id: new mongodb_1.ObjectId(client.data.userId) } });
            if (user && user.organizationIds) {
                for (const orgId of user.organizationIds) {
                    client.join(`org:${orgId}`);
                    client.to(`org:${orgId}`).emit('user:online', {
                        userId: client.data.userId,
                        timestamp: new Date()
                    });
                }
            }
            try {
                const unreadCount = await this.messagesService.getTotalUnreadCount(client.data.userId);
                console.log(`Sending initial unread count to user ${client.data.userId}: ${unreadCount}`);
                client.emit('message:count', { count: unreadCount });
            }
            catch (error) {
                console.error('Failed to send initial unread count:', error);
            }
        }
        catch (error) {
            console.log(`Client ${client.id} provided invalid token, disconnecting`);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        console.log(`Client ${client.id} disconnected`);
        if (client.data.userId) {
            await this.updateUserOnlineStatus(client.data.userId, false);
            const user = await this.userRepo.findOne({ where: { _id: new mongodb_1.ObjectId(client.data.userId) } });
            if (user && user.organizationIds) {
                for (const orgId of user.organizationIds) {
                    this.server.to(`org:${orgId}`).emit('user:offline', {
                        userId: client.data.userId,
                        lastSeen: new Date()
                    });
                }
            }
        }
    }
    handleJoin(client, payload) {
        if (payload?.room) {
            client.join(payload.room);
            console.log(`✅ Client ${client.id} (user: ${client.data.userId}) joined room: ${payload.room}`);
            const rooms = Array.from(client.rooms);
            console.log(`📋 Client ${client.id} is now in rooms:`, rooms);
        }
    }
    handleLeave(client, payload) {
        if (payload?.room) {
            client.leave(payload.room);
            console.log(`Client ${client.id} left room: ${payload.room}`);
        }
    }
    async handleSend(client, payload) {
        const msg = await this.messagesService.sendMessage(payload.conversationId, payload.senderId, payload.content);
        client.to(`conversation:${payload.conversationId}`).emit('message:new', msg);
        if (msg?.organizationId) {
            client.to(`org:${msg.organizationId}`).emit('message:org', msg);
        }
        try {
            const conversation = await this.messagesService['conversationRepo'].findOne({
                where: { _id: new mongodb_1.ObjectId(payload.conversationId) }
            });
            if (conversation) {
                const allMemberIds = conversation.memberIds;
                for (const memberId of allMemberIds) {
                    const unreadMessageCount = await this.messagesService.getTotalUnreadCount(String(memberId));
                    console.log(`WebSocket: Emitting message count ${unreadMessageCount} to user ${memberId}`);
                    this.server.to(`user:${memberId}`).emit('message:count', { count: unreadMessageCount });
                }
            }
        }
        catch (error) {
            console.error('Failed to emit message count updates:', error);
        }
    }
    handleTypingStart(client, payload) {
        client.to(`conversation:${payload.conversationId}`).emit('typing:update', {
            conversationId: payload.conversationId,
            userId: payload.userId,
            userName: payload.userName,
            isTyping: true,
        });
    }
    handleTypingStop(client, payload) {
        client.to(`conversation:${payload.conversationId}`).emit('typing:update', {
            conversationId: payload.conversationId,
            userId: payload.userId,
            isTyping: false,
        });
    }
    async handleMessageRead(client, payload) {
        await this.messagesService.markAsRead(payload.conversationId, payload.userId);
        client.to(`conversation:${payload.conversationId}`).emit('messages:read', {
            conversationId: payload.conversationId,
            userId: payload.userId,
        });
        const unreadCounts = await this.messagesService.getUnreadMessageCount(payload.userId);
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
        const unreadConversations = Object.values(unreadCounts).filter(count => count > 0).length;
        this.server.to(`user:${payload.userId}`).emit('message:count', { count: totalUnread });
        this.server.to(`user:${payload.userId}`).emit('conversation:count', { count: unreadConversations });
    }
    emitNotification(target, payload) {
        if (target.userId)
            this.server.to(`user:${target.userId}`).emit('notification:new', payload);
        if (target.orgId)
            this.server.to(`org:${target.orgId}`).emit('notification:new', payload);
    }
    emitRequest(target, payload) {
        if (target.userId)
            this.server.to(`user:${target.userId}`).emit('request:new', payload);
        if (target.orgId)
            this.server.to(`org:${target.orgId}`).emit('request:new', payload);
    }
    async updateUserOnlineStatus(userId, isOnline) {
        try {
            const user = await this.userRepo.findOne({ where: { _id: new mongodb_1.ObjectId(userId) } });
            if (user) {
                user.isOnline = isOnline;
                user.lastSeen = new Date();
                await this.userRepo.save(user);
            }
        }
        catch (error) {
            console.error('Failed to update user online status:', error);
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleSend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleTypingStop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessageRead", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*'
        },
        transports: ['websocket', 'polling']
    }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        notifications_service_1.NotificationsService,
        jwt_1.JwtService,
        typeorm_2.MongoRepository])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map