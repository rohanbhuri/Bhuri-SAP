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
exports.ProjectTrackingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const project_tracking_service_1 = require("./project-tracking.service");
let ProjectTrackingController = class ProjectTrackingController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    getMilestones(projectId, req) {
        return this.trackingService.getMilestones(req.user.organizationId, projectId);
    }
    createMilestone(milestoneData, req) {
        return this.trackingService.createMilestone(milestoneData, req.user.organizationId);
    }
    updateMilestone(id, updateData) {
        return this.trackingService.updateMilestone(id, updateData);
    }
    getTasks(projectId, req) {
        return this.trackingService.getTasks(req.user.organizationId, projectId);
    }
    createTask(taskData, req) {
        return this.trackingService.createTask(taskData, req.user.organizationId);
    }
    updateTask(id, updateData) {
        return this.trackingService.updateTask(id, updateData);
    }
    getProjectProgress(projectId) {
        return this.trackingService.getProjectProgress(projectId);
    }
    getStats(req) {
        return this.trackingService.getStats(req.user.organizationId);
    }
};
exports.ProjectTrackingController = ProjectTrackingController;
__decorate([
    (0, common_1.Get)('milestones'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "getMilestones", null);
__decorate([
    (0, common_1.Post)('milestones'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "createMilestone", null);
__decorate([
    (0, common_1.Put)('milestones/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "updateMilestone", null);
__decorate([
    (0, common_1.Get)('tasks'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Post)('tasks'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "createTask", null);
__decorate([
    (0, common_1.Put)('tasks/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Get)('progress/:projectId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "getProjectProgress", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectTrackingController.prototype, "getStats", null);
exports.ProjectTrackingController = ProjectTrackingController = __decorate([
    (0, common_1.Controller)('project-tracking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [project_tracking_service_1.ProjectTrackingService])
], ProjectTrackingController);
//# sourceMappingURL=project-tracking.controller.js.map