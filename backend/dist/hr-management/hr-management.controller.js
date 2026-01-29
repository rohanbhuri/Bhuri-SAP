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
exports.HrManagementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const hr_management_service_1 = require("./hr-management.service");
let HrManagementController = class HrManagementController {
    constructor(hrService) {
        this.hrService = hrService;
    }
    getEmployees(organizationId) {
        return this.hrService.getEmployees(organizationId);
    }
    getDepartments(organizationId) {
        return this.hrService.getDepartments(organizationId);
    }
    getStats(organizationId) {
        return this.hrService.getStats(organizationId);
    }
    createEmployee(employeeData, organizationId) {
        return this.hrService.createEmployee(employeeData, organizationId);
    }
    updateEmployee(id, employeeData) {
        return this.hrService.updateEmployee(id, employeeData);
    }
    deleteEmployee(id) {
        return this.hrService.deleteEmployee(id);
    }
    createDepartment(departmentData, organizationId) {
        return this.hrService.createDepartment(departmentData, organizationId);
    }
    updateDepartment(id, departmentData) {
        return this.hrService.updateDepartment(id, departmentData);
    }
    deleteDepartment(id) {
        return this.hrService.deleteDepartment(id);
    }
    getDepartmentEmployeeCount(id) {
        return this.hrService.getDepartmentEmployeeCount(id);
    }
    checkIn(body, organizationId) {
        return this.hrService.attendanceCheckIn(body.employeeId, organizationId, undefined, body.location);
    }
    checkOut(body, organizationId) {
        return this.hrService.attendanceCheckOut(body.employeeId, undefined, body.location);
    }
    getAttendance(employeeId, organizationId, from, to) {
        return this.hrService.getAttendance({ employeeId, organizationId, from, to });
    }
    createLeave(body, organizationId) {
        return this.hrService.createLeave(body, organizationId);
    }
    setLeaveStatus(id, body) {
        return this.hrService.setLeaveStatus(id, body.status);
    }
    listLeaves(employeeId, organizationId, status) {
        return this.hrService.listLeaves({ employeeId, organizationId, status });
    }
    createShift(body, organizationId) {
        return this.hrService.createShift(body, organizationId);
    }
    listShifts(organizationId) {
        return this.hrService.listShifts(organizationId);
    }
    addHoliday(body, organizationId) {
        return this.hrService.addHoliday(body, organizationId);
    }
    listHolidays(organizationId) {
        return this.hrService.listHolidays(organizationId);
    }
    upsertSalaryStructure(body, organizationId) {
        return this.hrService.upsertSalaryStructure(body, organizationId);
    }
    runPayroll(body) {
        return this.hrService.runPayroll(body.organizationId, body.month, body.year);
    }
    listPayrollRuns(organizationId) {
        return this.hrService.listPayrollRuns(organizationId);
    }
    getPayrollRun(id) {
        return this.hrService.getPayrollRun(id);
    }
    createGoal(body, organizationId) {
        return this.hrService.createGoal(body, organizationId);
    }
    updateGoal(id, body) {
        return this.hrService.updateGoal(id, body);
    }
    listGoals(employeeId, organizationId) {
        return this.hrService.listGoals({ employeeId, organizationId });
    }
    createReviewCycle(body, organizationId) {
        return this.hrService.createReviewCycle(body, organizationId);
    }
    submitFeedback(body, organizationId) {
        return this.hrService.submitFeedback(body, organizationId);
    }
    performanceAnalytics(organizationId) {
        return this.hrService.performanceAnalytics(organizationId);
    }
    createComplianceItem(body, organizationId) {
        return this.hrService.createComplianceItem(body, organizationId);
    }
    listComplianceItems(organizationId) {
        return this.hrService.listComplianceItems(organizationId);
    }
    scheduleComplianceEvent(body, organizationId) {
        return this.hrService.scheduleComplianceEvent(body, organizationId);
    }
    markComplianceCompleted(id) {
        return this.hrService.markComplianceCompleted(id);
    }
    complianceAlerts(organizationId) {
        return this.hrService.complianceAlerts(organizationId);
    }
    createDocumentRecord(body, organizationId) {
        return this.hrService.createDocumentRecord(body, organizationId);
    }
    listDocumentRecords(employeeId, organizationId) {
        return this.hrService.listDocumentRecords({ employeeId, organizationId });
    }
    createAsset(body, organizationId) {
        return this.hrService.createAsset(body, organizationId);
    }
    listAssets(organizationId) {
        return this.hrService.listAssets(organizationId);
    }
    assignAsset(body, organizationId) {
        return this.hrService.assignAsset(body.assetId, body.employeeId, organizationId);
    }
    returnAsset(id) {
        return this.hrService.returnAsset(id);
    }
};
exports.HrManagementController = HrManagementController;
__decorate([
    (0, common_1.Get)('employees'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)('employees/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)('employees/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Put)('departments/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)('departments/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "deleteDepartment", null);
__decorate([
    (0, common_1.Get)('departments/:id/employee-count'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getDepartmentEmployeeCount", null);
__decorate([
    (0, common_1.Post)('attendance/check-in'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('attendance/check-out'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('attendance'),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('organizationId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Post)('leaves'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createLeave", null);
__decorate([
    (0, common_1.Patch)('leaves/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "setLeaveStatus", null);
__decorate([
    (0, common_1.Get)('leaves'),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('organizationId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listLeaves", null);
__decorate([
    (0, common_1.Post)('shifts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createShift", null);
__decorate([
    (0, common_1.Get)('shifts'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listShifts", null);
__decorate([
    (0, common_1.Post)('holidays'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "addHoliday", null);
__decorate([
    (0, common_1.Get)('holidays'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listHolidays", null);
__decorate([
    (0, common_1.Post)('salary-structures'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "upsertSalaryStructure", null);
__decorate([
    (0, common_1.Post)('payroll/run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "runPayroll", null);
__decorate([
    (0, common_1.Get)('payroll/runs'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listPayrollRuns", null);
__decorate([
    (0, common_1.Get)('payroll/runs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "getPayrollRun", null);
__decorate([
    (0, common_1.Post)('goals'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createGoal", null);
__decorate([
    (0, common_1.Patch)('goals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.Get)('goals'),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listGoals", null);
__decorate([
    (0, common_1.Post)('review-cycles'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createReviewCycle", null);
__decorate([
    (0, common_1.Post)('feedback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "submitFeedback", null);
__decorate([
    (0, common_1.Get)('performance/analytics'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "performanceAnalytics", null);
__decorate([
    (0, common_1.Post)('compliance/items'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createComplianceItem", null);
__decorate([
    (0, common_1.Get)('compliance/items'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listComplianceItems", null);
__decorate([
    (0, common_1.Post)('compliance/events'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "scheduleComplianceEvent", null);
__decorate([
    (0, common_1.Patch)('compliance/events/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "markComplianceCompleted", null);
__decorate([
    (0, common_1.Get)('compliance/alerts'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "complianceAlerts", null);
__decorate([
    (0, common_1.Post)('documents'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createDocumentRecord", null);
__decorate([
    (0, common_1.Get)('documents'),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listDocumentRecords", null);
__decorate([
    (0, common_1.Post)('assets'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "createAsset", null);
__decorate([
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "listAssets", null);
__decorate([
    (0, common_1.Post)('assets/assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "assignAsset", null);
__decorate([
    (0, common_1.Patch)('assets/assignments/:id/return'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrManagementController.prototype, "returnAsset", null);
exports.HrManagementController = HrManagementController = __decorate([
    (0, common_1.Controller)('hr-management'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [hr_management_service_1.HrManagementService])
], HrManagementController);
//# sourceMappingURL=hr-management.controller.js.map