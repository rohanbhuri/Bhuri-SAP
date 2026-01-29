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
exports.ClientManagementController = void 0;
const common_1 = require("@nestjs/common");
const client_management_service_1 = require("./client-management.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const api_key_guard_1 = require("../guards/api-key.guard");
const public_decorator_1 = require("../decorators/public.decorator");
let ClientManagementController = class ClientManagementController {
    constructor(clientManagementService) {
        this.clientManagementService = clientManagementService;
    }
    async apiLogin(body, req) {
        const userAgent = req.headers['user-agent'];
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        return this.clientManagementService.apiLogin(body.email, body.password, body.deviceId, userAgent, ip);
    }
    async apiLogout(body) {
        return this.clientManagementService.apiLogout(body.clientId, body.deviceId);
    }
    async createClientRequest(requestData) {
        try {
            return await this.clientManagementService.createClientRequest(requestData);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllClientRequests() {
        return this.clientManagementService.getAllClientRequests();
    }
    async getClientRequestById(requestId) {
        return this.clientManagementService.getClientRequestById(requestId);
    }
    async updateClientRequest(requestId, updateData, req) {
        return this.clientManagementService.updateClientRequest(requestId, updateData, req.user.userId);
    }
    async convertToClient(requestId, conversionData, req) {
        return this.clientManagementService.convertToClient(requestId, conversionData, req.user.userId);
    }
    async deleteClientRequest(requestId, req) {
        return this.clientManagementService.deleteClientRequest(requestId, req.user?.userId);
    }
    async getAllClients() {
        return this.clientManagementService.getAllClients();
    }
    async getClientById(clientId) {
        return this.clientManagementService.getClientById(clientId);
    }
    async updateClient(clientId, updateData, req) {
        return this.clientManagementService.updateClient(clientId, updateData, req.user?.userId);
    }
    async deleteClient(clientId, req) {
        return this.clientManagementService.deleteClient(clientId, req.user?.userId);
    }
    async toggleClientStatus(clientId, body) {
        return this.clientManagementService.toggleClientStatus(clientId, body.isActive);
    }
    async requestLoginCredentials(clientId, credentialData) {
        return this.clientManagementService.requestLoginCredentials(clientId, credentialData);
    }
    async getSecuritySettings(clientId) {
        return this.clientManagementService.getSecuritySettings(clientId);
    }
    async updateSecuritySettings(clientId, settings) {
        return this.clientManagementService.updateSecuritySettings(clientId, settings);
    }
    async createContactMessage(messageData) {
        return this.clientManagementService.createContactMessage(messageData);
    }
    async getAllContactMessages() {
        return this.clientManagementService.getAllContactMessages();
    }
    async getContactUnreadCount() {
        const count = await this.clientManagementService.getContactUnreadCount();
        return { count };
    }
    async getContactMessageById(messageId) {
        return this.clientManagementService.getContactMessageById(messageId);
    }
    async markContactMessageAsRead(messageId) {
        return this.clientManagementService.markContactMessageAsRead(messageId);
    }
    async deleteContactMessage(messageId, req) {
        return this.clientManagementService.deleteContactMessage(messageId, req.user?.userId);
    }
    async getAnalytics() {
        return this.clientManagementService.getAnalytics();
    }
    async exportRequests() {
        return this.clientManagementService.exportRequestsCSV();
    }
    async exportClients() {
        return this.clientManagementService.exportClientsCSV();
    }
    async exportContactMessages() {
        return this.clientManagementService.exportContactMessagesCSV();
    }
};
exports.ClientManagementController = ClientManagementController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "apiLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "apiLogout", null);
__decorate([
    (0, common_1.Post)('requests'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "createClientRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getAllClientRequests", null);
__decorate([
    (0, common_1.Get)('requests/:requestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getClientRequestById", null);
__decorate([
    (0, common_1.Put)('requests/:requestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "updateClientRequest", null);
__decorate([
    (0, common_1.Post)('requests/:requestId/convert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "convertToClient", null);
__decorate([
    (0, common_1.Delete)('requests/:requestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "deleteClientRequest", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getAllClients", null);
__decorate([
    (0, common_1.Get)('clients/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getClientById", null);
__decorate([
    (0, common_1.Put)('clients/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "updateClient", null);
__decorate([
    (0, common_1.Delete)('clients/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "deleteClient", null);
__decorate([
    (0, common_1.Put)('clients/:clientId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "toggleClientStatus", null);
__decorate([
    (0, common_1.Post)('clients/:clientId/request-credentials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "requestLoginCredentials", null);
__decorate([
    (0, common_1.Get)('clients/:clientId/security-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getSecuritySettings", null);
__decorate([
    (0, common_1.Put)('clients/:clientId/security-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "updateSecuritySettings", null);
__decorate([
    (0, common_1.Post)('contact-us'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "createContactMessage", null);
__decorate([
    (0, common_1.Get)('contact-us'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getAllContactMessages", null);
__decorate([
    (0, common_1.Get)('contact-us/unread-count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getContactUnreadCount", null);
__decorate([
    (0, common_1.Get)('contact-us/:messageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getContactMessageById", null);
__decorate([
    (0, common_1.Put)('contact-us/:messageId/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "markContactMessageAsRead", null);
__decorate([
    (0, common_1.Delete)('contact-us/:messageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "deleteContactMessage", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('export/requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "exportRequests", null);
__decorate([
    (0, common_1.Get)('export/clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "exportClients", null);
__decorate([
    (0, common_1.Get)('export/contact-us'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientManagementController.prototype, "exportContactMessages", null);
exports.ClientManagementController = ClientManagementController = __decorate([
    (0, common_1.Controller)('client-management'),
    __metadata("design:paramtypes", [client_management_service_1.ClientManagementService])
], ClientManagementController);
//# sourceMappingURL=client-management.controller.js.map