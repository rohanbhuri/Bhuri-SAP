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
exports.OrganizationManagementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const organization_management_service_1 = require("./organization-management.service");
let OrganizationManagementController = class OrganizationManagementController {
    constructor(orgManagementService) {
        this.orgManagementService = orgManagementService;
    }
    findAllOrganizations() {
        return this.orgManagementService.findAll();
    }
    createOrganization(orgData) {
        return this.orgManagementService.create(orgData);
    }
    updateOrganization(id, updateData) {
        return this.orgManagementService.update(id, updateData);
    }
    deleteOrganization(id) {
        return this.orgManagementService.delete(id);
    }
    getOrganizationRequests() {
        return this.orgManagementService.getOrganizationRequests();
    }
    approveRequest(id) {
        if (!id || id === 'undefined') {
            throw new common_1.BadRequestException('Valid request ID is required');
        }
        return this.orgManagementService.approveRequest(id);
    }
    rejectRequest(id) {
        if (!id || id === 'undefined') {
            throw new common_1.BadRequestException('Valid request ID is required');
        }
        return this.orgManagementService.rejectRequest(id);
    }
    requestToJoinOrganization(req, body) {
        console.log('Request body:', body);
        console.log('User:', req.user);
        if (!body.organizationId) {
            throw new common_1.BadRequestException('Organization ID is required');
        }
        return this.orgManagementService.requestToJoin(req.user.userId, body.organizationId);
    }
    updateOrganizationModules(id, body) {
        return this.orgManagementService.updateOrganizationModules(id, body.moduleIds);
    }
    switchCurrentOrganization(req, organizationId) {
        return this.orgManagementService.switchUserOrganization(req.user.userId, organizationId);
    }
};
exports.OrganizationManagementController = OrganizationManagementController;
__decorate([
    (0, common_1.Get)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "findAllOrganizations", null);
__decorate([
    (0, common_1.Post)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Put)('organizations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "updateOrganization", null);
__decorate([
    (0, common_1.Delete)('organizations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "deleteOrganization", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "getOrganizationRequests", null);
__decorate([
    (0, common_1.Put)('requests/:id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Put)('requests/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Post)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "requestToJoinOrganization", null);
__decorate([
    (0, common_1.Put)('organizations/:id/modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "updateOrganizationModules", null);
__decorate([
    (0, common_1.Put)('switch-organization/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrganizationManagementController.prototype, "switchCurrentOrganization", null);
exports.OrganizationManagementController = OrganizationManagementController = __decorate([
    (0, common_1.Controller)('organization-management'),
    __metadata("design:paramtypes", [organization_management_service_1.OrganizationManagementService])
], OrganizationManagementController);
//# sourceMappingURL=organization-management.controller.js.map