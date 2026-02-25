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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const public_decorator_1 = require("../decorators/public.decorator");
const notifications_service_1 = require("./notifications.service");
const mail_service_1 = require("./mail.service");
let NotificationsController = class NotificationsController {
    constructor(notificationsService, mailService) {
        this.notificationsService = notificationsService;
        this.mailService = mailService;
    }
    async testEmail() {
        try {
            await this.mailService.sendContactUsNotification({
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test Email',
                message: 'This is a test email to verify SMTP configuration.'
            });
            return { success: true, message: 'Test email sent successfully!' };
        }
        catch (error) {
            return { success: false, error: error.message || String(error) };
        }
    }
    async getNotifications(req, limit, skip, unreadOnly, type) {
        const userId = req.user.id || req.user.userId || req.user._id;
        console.log('getNotifications - User from JWT:', req.user);
        console.log('getNotifications - userId:', userId);
        const limitNum = limit ? parseInt(limit, 10) : 50;
        const skipNum = skip ? parseInt(skip, 10) : 0;
        const unreadOnlyBool = unreadOnly === 'true';
        if (type) {
            return this.notificationsService.getNotificationsByType(userId, type, limitNum);
        }
        const results = await this.notificationsService.getUserNotifications(userId, limitNum, skipNum, unreadOnlyBool);
        console.log('getNotifications - results count:', results.length);
        return results;
    }
    async getUnreadCount(req) {
        const userId = req.user.id || req.user.userId || req.user._id;
        const count = await this.notificationsService.getUnreadCount(userId);
        return { count };
    }
    async getMessageNotifications(req, conversationId) {
        const userId = req.user.id;
        return this.notificationsService.getMessageNotifications(userId, conversationId);
    }
    async markAsRead(id) {
        const notification = await this.notificationsService.markAsRead(id);
        return { success: true, notification };
    }
    async markAllAsRead(req) {
        const userId = req.user.id;
        const result = await this.notificationsService.markAllAsRead(userId);
        return { success: true, ...result };
    }
    async markConversationAsRead(req, conversationId) {
        try {
            const userId = req.user.id;
            const result = await this.notificationsService.markConversationNotificationsAsRead(userId, conversationId);
            return { success: true, ...result };
        }
        catch (error) {
            if (error.message.includes('Invalid')) {
                return {
                    success: false,
                    error: error.message,
                    modifiedCount: 0
                };
            }
            throw error;
        }
    }
    async deleteNotification(id) {
        const success = await this.notificationsService.deleteNotification(id);
        return { success };
    }
    async cleanupOldNotifications(days) {
        const daysNum = days ? parseInt(days, 10) : 30;
        const result = await this.notificationsService.deleteOldNotifications(daysNum);
        return { success: true, ...result };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('test-email'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('unreadOnly')),
    __param(4, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMessageNotifications", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)('conversation/:conversationId/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markConversationAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Delete)('cleanup/old'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "cleanupOldNotifications", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        mail_service_1.MailService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map