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
exports.ProjectsManagementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const projects_management_service_1 = require("./projects-management.service");
let ProjectsManagementController = class ProjectsManagementController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    getProjects(req) {
        console.log('Get projects - User object:', req.user);
        return this.projectsService.getProjects(req.user.organizationId, req.user.userId);
    }
    getProject(id) {
        return this.projectsService.getProjectById(id);
    }
    createProject(projectData, req) {
        console.log('User object:', req.user);
        return this.projectsService.createProject(projectData, req.user.organizationId, req.user.userId);
    }
    updateProject(id, updateData) {
        return this.projectsService.updateProject(id, updateData);
    }
    deleteProject(id) {
        return this.projectsService.deleteProject(id);
    }
    convertLeadToProject(conversionData, req) {
        const { leadId, projectData } = conversionData;
        return this.projectsService.convertLeadToProject(leadId, projectData, req.user.userId, req.user.organizationId);
    }
    assignUsersToProject(projectId, assignmentData, req) {
        return this.projectsService.assignUsersToProject(projectId, assignmentData.userIds, req.user.userId, req.user.organizationId);
    }
    getPipelines(req) {
        return this.projectsService.getPipelines(req.user.organizationId);
    }
    createPipeline(pipelineData, req) {
        return this.projectsService.createPipeline(pipelineData, req.user.organizationId);
    }
    getProjectDeliverables(projectId) {
        return this.projectsService.getProjectDeliverables(projectId);
    }
    createDeliverable(projectId, deliverableData, req) {
        return this.projectsService.createDeliverable(deliverableData, projectId, req.user.organizationId);
    }
    updateDeliverable(id, updateData) {
        return this.projectsService.updateDeliverable(id, updateData);
    }
    deleteDeliverable(id) {
        return this.projectsService.deleteDeliverable(id);
    }
    getStats(req) {
        return this.projectsService.getStats(req.user.organizationId);
    }
};
exports.ProjectsManagementController = ProjectsManagementController;
__decorate([
    (0, common_1.Get)('projects'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('projects/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "getProject", null);
__decorate([
    (0, common_1.Post)('projects'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)('projects/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)('projects/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Post)('convert-lead'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "convertLeadToProject", null);
__decorate([
    (0, common_1.Patch)('projects/:id/assign-users'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "assignUsersToProject", null);
__decorate([
    (0, common_1.Get)('pipelines'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "getPipelines", null);
__decorate([
    (0, common_1.Post)('pipelines'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "createPipeline", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/deliverables'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "getProjectDeliverables", null);
__decorate([
    (0, common_1.Post)('projects/:projectId/deliverables'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "createDeliverable", null);
__decorate([
    (0, common_1.Put)('deliverables/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "updateDeliverable", null);
__decorate([
    (0, common_1.Delete)('deliverables/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "deleteDeliverable", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsManagementController.prototype, "getStats", null);
exports.ProjectsManagementController = ProjectsManagementController = __decorate([
    (0, common_1.Controller)('projects-management'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [projects_management_service_1.ProjectsManagementService])
], ProjectsManagementController);
//# sourceMappingURL=projects-management.controller.js.map