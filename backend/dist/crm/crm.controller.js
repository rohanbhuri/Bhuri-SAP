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
exports.CrmController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const crm_service_1 = require("./crm.service");
let CrmController = class CrmController {
    constructor(crmService) {
        this.crmService = crmService;
    }
    async getDashboard(req) {
        return this.crmService.getDashboardStats(req.user.organizationId);
    }
    async getContacts(req) {
        return this.crmService.getContacts(req.user.organizationId);
    }
    async createContact(contactData, req) {
        return this.crmService.createContact(contactData, req.user.organizationId);
    }
    async getLeads(req) {
        return this.crmService.getLeads(req.user.organizationId);
    }
    async createLead(leadData, req) {
        return this.crmService.createLead(leadData, req.user.organizationId);
    }
    async getDeals(req) {
        return this.crmService.getDeals(req.user.organizationId);
    }
    async createDeal(dealData, req) {
        return this.crmService.createDeal(dealData, req.user.organizationId);
    }
    async getTasks(req) {
        return this.crmService.getTasks(req.user.organizationId);
    }
    async createTask(taskData, req) {
        return this.crmService.createTask(taskData, req.user.organizationId);
    }
    async convertContactToLead(leadData, req, contactId) {
        return this.crmService.convertContactToLead(contactId, leadData, req.user.organizationId);
    }
    async convertLeadToDeal(dealData, req, leadId) {
        return this.crmService.convertLeadToDeal(leadId, dealData, req.user.organizationId);
    }
    async createTaskForDeal(taskData, req, dealId) {
        return this.crmService.createTaskForDeal(dealId, taskData, req.user.organizationId);
    }
    async getContactsWithLeads(req) {
        return this.crmService.getContactsWithLeads(req.user.organizationId);
    }
    async getLeadsWithDeals(req) {
        return this.crmService.getLeadsWithDeals(req.user.organizationId);
    }
    async getDealsWithTasks(req) {
        return this.crmService.getDealsWithTasks(req.user.organizationId);
    }
    async getTasksWithRelations(req) {
        return this.crmService.getTasksWithRelations(req.user.organizationId);
    }
    async getConversionReport(req) {
        return this.crmService.getConversionReport(req.user.organizationId);
    }
    async updateContact(id, contactData, req) {
        return this.crmService.updateContact(id, contactData, req.user.organizationId);
    }
    async deleteContact(id, req) {
        return this.crmService.deleteContact(id, req.user.organizationId);
    }
    async updateLead(id, leadData, req) {
        return this.crmService.updateLead(id, leadData, req.user.organizationId);
    }
    async deleteLead(id, req) {
        return this.crmService.deleteLead(id, req.user.organizationId);
    }
    async updateDeal(id, dealData, req) {
        return this.crmService.updateDeal(id, dealData, req.user.organizationId);
    }
    async deleteDeal(id, req) {
        return this.crmService.deleteDeal(id, req.user.organizationId);
    }
    async updateTask(id, taskData, req) {
        return this.crmService.updateTask(id, taskData, req.user.organizationId);
    }
    async deleteTask(id, req) {
        return this.crmService.deleteTask(id, req.user.organizationId);
    }
    async getOrganizationUsers(req) {
        return this.crmService.getOrganizationUsers(req.user.organizationId);
    }
    async getMyAssignments(req) {
        return this.crmService.getMyAssignments(req.user.userId, req.user.organizationId);
    }
    async assignContact(id, body, req) {
        return this.crmService.assignContact(id, body.assignedToId, req.user.organizationId);
    }
    async unassignContact(id, req) {
        return this.crmService.unassignContact(id, req.user.organizationId);
    }
    async assignLead(id, body, req) {
        return this.crmService.assignLead(id, body.assignedToId, req.user.organizationId);
    }
    async unassignLead(id, req) {
        return this.crmService.unassignLead(id, req.user.organizationId);
    }
    async assignDeal(id, body, req) {
        return this.crmService.assignDeal(id, body.assignedToId, req.user.organizationId);
    }
    async unassignDeal(id, req) {
        return this.crmService.unassignDeal(id, req.user.organizationId);
    }
    async assignTask(id, body, req) {
        return this.crmService.assignTask(id, body.assignedToId, req.user.organizationId);
    }
    async unassignTask(id, req) {
        return this.crmService.unassignTask(id, req.user.organizationId);
    }
    async bulkAssignContacts(body, req) {
        return this.crmService.bulkAssignContacts(body.contactIds, body.assignedToId, req.user.organizationId);
    }
    async bulkAssignLeads(body, req) {
        return this.crmService.bulkAssignLeads(body.leadIds, body.assignedToId, req.user.organizationId);
    }
    async bulkAssignDeals(body, req) {
        return this.crmService.bulkAssignDeals(body.dealIds, body.assignedToId, req.user.organizationId);
    }
    async bulkAssignTasks(body, req) {
        return this.crmService.bulkAssignTasks(body.taskIds, body.assignedToId, req.user.organizationId);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('contacts'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('contacts'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Post)('leads'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createLead", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDeals", null);
__decorate([
    (0, common_1.Post)('deals'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Get)('tasks'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Post)('tasks'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createTask", null);
__decorate([
    (0, common_1.Post)('contacts/:id/convert-to-lead'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "convertContactToLead", null);
__decorate([
    (0, common_1.Post)('leads/:id/convert-to-deal'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "convertLeadToDeal", null);
__decorate([
    (0, common_1.Post)('deals/:id/create-task'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "createTaskForDeal", null);
__decorate([
    (0, common_1.Get)('contacts-with-leads'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getContactsWithLeads", null);
__decorate([
    (0, common_1.Get)('leads-with-deals'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getLeadsWithDeals", null);
__decorate([
    (0, common_1.Get)('deals-with-tasks'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getDealsWithTasks", null);
__decorate([
    (0, common_1.Get)('tasks-with-relations'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getTasksWithRelations", null);
__decorate([
    (0, common_1.Get)('conversion-report'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getConversionReport", null);
__decorate([
    (0, common_1.Put)('contacts/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)('contacts/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Put)('leads/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Delete)('leads/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteLead", null);
__decorate([
    (0, common_1.Put)('deals/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Delete)('deals/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteDeal", null);
__decorate([
    (0, common_1.Put)('tasks/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:id'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getOrganizationUsers", null);
__decorate([
    (0, common_1.Get)('my-assignments'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getMyAssignments", null);
__decorate([
    (0, common_1.Put)('contacts/:id/assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "assignContact", null);
__decorate([
    (0, common_1.Put)('contacts/:id/unassign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "unassignContact", null);
__decorate([
    (0, common_1.Put)('leads/:id/assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "assignLead", null);
__decorate([
    (0, common_1.Put)('leads/:id/unassign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "unassignLead", null);
__decorate([
    (0, common_1.Put)('deals/:id/assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "assignDeal", null);
__decorate([
    (0, common_1.Put)('deals/:id/unassign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "unassignDeal", null);
__decorate([
    (0, common_1.Put)('tasks/:id/assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "assignTask", null);
__decorate([
    (0, common_1.Put)('tasks/:id/unassign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "unassignTask", null);
__decorate([
    (0, common_1.Put)('contacts/bulk-assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkAssignContacts", null);
__decorate([
    (0, common_1.Put)('leads/bulk-assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkAssignLeads", null);
__decorate([
    (0, common_1.Put)('deals/bulk-assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkAssignDeals", null);
__decorate([
    (0, common_1.Put)('tasks/bulk-assign'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "bulkAssignTasks", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)('crm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map