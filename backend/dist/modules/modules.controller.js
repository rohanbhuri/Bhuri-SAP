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
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const modules_service_1 = require("./modules.service");
let ModulesController = class ModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    findAll() {
        return this.modulesService.findAll();
    }
    getActiveModules(req) {
        return this.modulesService.getActiveModulesForOrg(req.user.organizationId, req.user.userId);
    }
    getPersonalModules(req) {
        return this.modulesService.getPersonalModules(req.user.userId);
    }
    getOrganizationModules(orgId, req) {
        return this.modulesService.getActiveModulesForOrg(orgId, req.user.userId);
    }
    activateModule(id, req) {
        const orgId = req.user.organizationId || 'personal';
        return this.modulesService.activateModule(id, orgId, req.user.userId);
    }
    deactivateModule(id, req) {
        const orgId = req.user.organizationId || 'personal';
        return this.modulesService.deactivateModule(id, orgId, req.user.userId);
    }
    async getAvailableModules(req) {
        const orgId = req.user.organizationId || 'personal';
        console.log('Getting available modules for context:', orgId, 'user:', req.user.userId);
        return this.modulesService.getAllAvailable(orgId, req.user.userId);
    }
    requestActivation(id, req) {
        const orgId = req.user.organizationId || 'personal';
        return this.modulesService.requestActivation(id, req.user.userId, orgId, req.user.roles);
    }
    async getPendingRequests(req, status = 'pending') {
        console.log('=== MODULE REQUESTS ENDPOINT ===');
        console.log('User data:', req.user);
        console.log('User roles:', req.user.roles);
        console.log('Status filter:', status);
        const userRoles = req.user.roles || [];
        const isSuperAdmin = userRoles.includes('super_admin');
        const isAdmin = userRoles.includes('admin');
        if (!isSuperAdmin && !isAdmin) {
            console.log('User lacks required permissions');
            throw new Error('Insufficient permissions to view module requests');
        }
        const orgId = req.user.organizationId;
        console.log('Organization ID:', orgId);
        console.log('Is Super Admin:', isSuperAdmin);
        return this.modulesService.getPendingRequests(orgId, isSuperAdmin, req.user.userId, status);
    }
    async approveRequest(id, req) {
        console.log('=== APPROVE REQUEST ===');
        console.log('Request ID:', id);
        console.log('User:', req.user);
        const userRoles = req.user.roles || [];
        const isSuperAdmin = userRoles.includes('super_admin');
        const isAdmin = userRoles.includes('admin');
        if (!isSuperAdmin && !isAdmin) {
            throw new Error('Insufficient permissions to approve module requests');
        }
        return this.modulesService.approveRequest(id, req.user.userId);
    }
    async rejectRequest(id, req) {
        console.log('=== REJECT REQUEST ===');
        console.log('Request ID:', id);
        console.log('User:', req.user);
        const userRoles = req.user.roles || [];
        const isSuperAdmin = userRoles.includes('super_admin');
        const isAdmin = userRoles.includes('admin');
        if (!isSuperAdmin && !isAdmin) {
            throw new Error('Insufficient permissions to reject module requests');
        }
        return this.modulesService.rejectRequest(id, req.user.userId);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "getActiveModules", null);
__decorate([
    (0, common_1.Get)('personal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "getPersonalModules", null);
__decorate([
    (0, common_1.Get)('organization/:orgId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "getOrganizationModules", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "activateModule", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "deactivateModule", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "getAvailableModules", null);
__decorate([
    (0, common_1.Post)(':id/request'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "requestActivation", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Patch)('requests/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Patch)('requests/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "rejectRequest", null);
exports.ModulesController = ModulesController = __decorate([
    (0, common_1.Controller)('modules'),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map