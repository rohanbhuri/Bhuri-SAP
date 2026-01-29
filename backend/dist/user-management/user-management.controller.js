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
exports.UserManagementController = void 0;
const common_1 = require("@nestjs/common");
const user_management_service_1 = require("./user-management.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const api_key_guard_1 = require("../guards/api-key.guard");
let UserManagementController = class UserManagementController {
    constructor(userManagementService) {
        this.userManagementService = userManagementService;
    }
    async apiLogin(body, req) {
        const userAgent = req.headers['user-agent'];
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        return this.userManagementService.apiLogin(body.email, body.password, body.deviceId, userAgent, ip);
    }
    async apiLogout(body) {
        return this.userManagementService.apiLogout(body.userId, body.deviceId);
    }
    async getAllUsers(req, search) {
        if (search) {
            return this.userManagementService.searchUsers(search, req.user);
        }
        return this.userManagementService.getAllUsers(req.user);
    }
    async createUser(userData) {
        return this.userManagementService.createUser(userData);
    }
    async updateUser(userId, userData) {
        return this.userManagementService.updateUser(userId, userData);
    }
    async deleteUser(userId, req) {
        return this.userManagementService.deleteUser(userId, req.user?.userId);
    }
    async toggleUserStatus(userId, body) {
        return this.userManagementService.toggleUserStatus(userId, body.isActive);
    }
    async getAllOrganizations() {
        return this.userManagementService.getAllOrganizations();
    }
    async getAllRoles(search) {
        if (search) {
            return this.userManagementService.searchRoles(search);
        }
        return this.userManagementService.getAllRoles();
    }
    async getAllPermissions(search) {
        if (search) {
            return this.userManagementService.searchPermissions(search);
        }
        return this.userManagementService.getAllPermissions();
    }
    async getAllModules() {
        return this.userManagementService.getAllModules();
    }
    async updateUserRoles(userId, body) {
        return this.userManagementService.updateUserRoles(userId, body.roleIds);
    }
    async createRole(roleData, req) {
        return this.userManagementService.createRole(roleData, req.user?.userId);
    }
    async updateRole(roleId, roleData, req) {
        return this.userManagementService.updateRole(roleId, roleData, req.user?.userId);
    }
    async createPermission(permissionData, req) {
        return this.userManagementService.createPermission(permissionData, req.user?.userId);
    }
    async updatePermission(permissionId, permissionData, req) {
        return this.userManagementService.updatePermission(permissionId, permissionData, req.user?.userId);
    }
    async deletePermission(permissionId, req) {
        return this.userManagementService.deletePermission(permissionId, req.user?.userId);
    }
    async deleteRole(roleId, req) {
        return this.userManagementService.deleteRole(roleId, req.user?.userId);
    }
};
exports.UserManagementController = UserManagementController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "apiLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "apiLogout", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('users/:userId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "toggleUserStatus", null);
__decorate([
    (0, common_1.Get)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllOrganizations", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Get)('modules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "getAllModules", null);
__decorate([
    (0, common_1.Put)('users/:userId/roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "updateUserRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:roleId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Put)('permissions/:permissionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('permissionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Delete)('permissions/:permissionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('permissionId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "deletePermission", null);
__decorate([
    (0, common_1.Delete)('roles/:roleId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserManagementController.prototype, "deleteRole", null);
exports.UserManagementController = UserManagementController = __decorate([
    (0, common_1.Controller)('user-management'),
    __metadata("design:paramtypes", [user_management_service_1.UserManagementService])
], UserManagementController);
//# sourceMappingURL=user-management.controller.js.map