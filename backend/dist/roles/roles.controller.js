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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const roles_service_1 = require("./roles.service");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    findAll() {
        return this.rolesService.findAll();
    }
    findOne(id) {
        return this.rolesService.findOne(id);
    }
    create(roleData) {
        return this.rolesService.create(roleData);
    }
    update(id, updateData) {
        return this.rolesService.update(id, updateData);
    }
    delete(id) {
        return this.rolesService.delete(id);
    }
    getAllPermissions() {
        return this.rolesService.getAllPermissions();
    }
    createPermission(permissionData) {
        return this.rolesService.createPermission(permissionData);
    }
    updatePermission(id, permissionData) {
        return this.rolesService.updatePermission(id, permissionData);
    }
    deletePermission(id) {
        return this.rolesService.deletePermission(id);
    }
    assignPermission(id, { permissionId }) {
        return this.rolesService.assignPermission(id, permissionId);
    }
    removePermission(id, permissionId) {
        return this.rolesService.removePermission(id, permissionId);
    }
    getPermissionTemplates() {
        return this.rolesService.getPermissionTemplates();
    }
    applyPermissionTemplate(id, { templateId }) {
        return this.rolesService.applyPermissionTemplate(id, templateId);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('permissions/all'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Post)('permissions'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Put)('permissions/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Delete)('permissions/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "deletePermission", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "assignPermission", null);
__decorate([
    (0, common_1.Delete)(':id/permissions/:permissionId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "removePermission", null);
__decorate([
    (0, common_1.Get)('templates/permission'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getPermissionTemplates", null);
__decorate([
    (0, common_1.Post)(':id/apply-template'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "applyPermissionTemplate", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map