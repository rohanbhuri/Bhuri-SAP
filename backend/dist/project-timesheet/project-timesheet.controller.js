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
exports.ProjectTimesheetController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const project_timesheet_service_1 = require("./project-timesheet.service");
let ProjectTimesheetController = class ProjectTimesheetController {
    constructor(timesheetService) {
        this.timesheetService = timesheetService;
    }
    async getEntries(query, req) {
        return this.timesheetService.getEntries(req.user.organizationId, query);
    }
    async createEntry(entryData, req) {
        return this.timesheetService.createEntry(entryData, req.user.organizationId);
    }
    async updateEntry(id, updateData) {
        return this.timesheetService.updateEntry(id, updateData);
    }
    async approveEntries(approvalData, req) {
        return this.timesheetService.approveEntries(approvalData.entryIds, req.user.userId);
    }
    async generateInvoice(projectId, invoiceData, req) {
        return this.timesheetService.generateInvoice(projectId, req.user.organizationId, invoiceData);
    }
    async getProjectBillingSummary(projectId, req) {
        return this.timesheetService.getProjectBillingSummary(projectId, req.user.organizationId);
    }
    async getStats(req) {
        return this.timesheetService.getStats(req.user.organizationId);
    }
};
exports.ProjectTimesheetController = ProjectTimesheetController;
__decorate([
    (0, common_1.Get)('entries'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "getEntries", null);
__decorate([
    (0, common_1.Post)('entries'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "createEntry", null);
__decorate([
    (0, common_1.Put)('entries/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "updateEntry", null);
__decorate([
    (0, common_1.Patch)('entries/approve'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "approveEntries", null);
__decorate([
    (0, common_1.Post)('projects/:projectId/generate-invoice'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "generateInvoice", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/billing-summary'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "getProjectBillingSummary", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectTimesheetController.prototype, "getStats", null);
exports.ProjectTimesheetController = ProjectTimesheetController = __decorate([
    (0, common_1.Controller)('project-timesheet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [project_timesheet_service_1.ProjectTimesheetService])
], ProjectTimesheetController);
//# sourceMappingURL=project-timesheet.controller.js.map