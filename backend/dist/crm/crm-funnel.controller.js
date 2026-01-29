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
exports.CrmFunnelController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const crm_funnel_service_1 = require("./crm-funnel.service");
let CrmFunnelController = class CrmFunnelController {
    constructor(crmFunnelService) {
        this.crmFunnelService = crmFunnelService;
    }
    async getFunnelDashboard(req) {
        return this.crmFunnelService.getFunnelDashboard(req.user.organizationId);
    }
    async getPipeline(req) {
        return this.crmFunnelService.getPipeline(req.user.organizationId);
    }
    async getContactWithHistory(contactId, req) {
        return this.crmFunnelService.getContactWithHistory(contactId, req.user.organizationId);
    }
    async getEnquiries(req) {
        return this.crmFunnelService.getEnquiries(req.user.organizationId);
    }
    async createEnquiryFromContact(contactId, enquiryData, req) {
        return this.crmFunnelService.createEnquiryFromContact(contactId, enquiryData, req.user.organizationId);
    }
    async markEnquiryLost(enquiryId, body, req) {
        return this.crmFunnelService.markEnquiryLost(enquiryId, body.reason, req.user.organizationId);
    }
    async markEnquiryOnHold(enquiryId, body, req) {
        return this.crmFunnelService.markEnquiryOnHold(enquiryId, body.followUpDate, req.user.organizationId);
    }
    async getPresentations(req) {
        return this.crmFunnelService.getPresentations(req.user.organizationId);
    }
    async createPresentationFromEnquiry(enquiryId, presentationData, req) {
        return this.crmFunnelService.createPresentationFromEnquiry(enquiryId, presentationData, req.user.userId, req.user.organizationId);
    }
    async sendPresentation(presentationId, req) {
        return this.crmFunnelService.sendPresentation(presentationId, req.user.organizationId);
    }
    async getQuotations(req) {
        return this.crmFunnelService.getQuotations(req.user.organizationId);
    }
    async createQuotationFromEnquiry(enquiryId, quotationData, req) {
        return this.crmFunnelService.createQuotationFromEnquiry(enquiryId, quotationData, req.user.organizationId);
    }
    async acceptQuotation(quotationId, req) {
        return this.crmFunnelService.acceptQuotation(quotationId, req.user.organizationId);
    }
    async declineQuotation(quotationId, body, req) {
        return this.crmFunnelService.declineQuotation(quotationId, body.reason, req.user.organizationId);
    }
    async getOrders(req) {
        return this.crmFunnelService.getOrders(req.user.organizationId);
    }
    async createOrderFromQuotation(quotationId, req) {
        return this.crmFunnelService.createOrderFromQuotation(quotationId, req.user.organizationId);
    }
    async updateOrderPaymentStatus(orderId, body, req) {
        return this.crmFunnelService.updateOrderPaymentStatus(orderId, body.paymentStatus, req.user.organizationId);
    }
    async updateOrderDeliveryStatus(orderId, body, req) {
        return this.crmFunnelService.updateOrderDeliveryStatus(orderId, body.deliveryStatus, req.user.organizationId);
    }
};
exports.CrmFunnelController = CrmFunnelController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getFunnelDashboard", null);
__decorate([
    (0, common_1.Get)('pipeline'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getPipeline", null);
__decorate([
    (0, common_1.Get)('contacts/:id/history'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getContactWithHistory", null);
__decorate([
    (0, common_1.Get)('enquiries'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getEnquiries", null);
__decorate([
    (0, common_1.Post)('enquiries/from-contact/:contactId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('contactId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "createEnquiryFromContact", null);
__decorate([
    (0, common_1.Put)('enquiries/:id/mark-lost'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "markEnquiryLost", null);
__decorate([
    (0, common_1.Put)('enquiries/:id/mark-on-hold'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "markEnquiryOnHold", null);
__decorate([
    (0, common_1.Get)('presentations'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getPresentations", null);
__decorate([
    (0, common_1.Post)('presentations/from-enquiry/:enquiryId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('enquiryId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "createPresentationFromEnquiry", null);
__decorate([
    (0, common_1.Post)('presentations/:id/send'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "sendPresentation", null);
__decorate([
    (0, common_1.Get)('quotations'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getQuotations", null);
__decorate([
    (0, common_1.Post)('quotations/from-enquiry/:enquiryId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('enquiryId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "createQuotationFromEnquiry", null);
__decorate([
    (0, common_1.Post)('quotations/:id/accept'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.CLIENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "acceptQuotation", null);
__decorate([
    (0, common_1.Post)('quotations/:id/decline'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.CLIENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "declineQuotation", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.STAFF),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders/from-quotation/:quotationId'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('quotationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "createOrderFromQuotation", null);
__decorate([
    (0, common_1.Put)('orders/:id/payment-status'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "updateOrderPaymentStatus", null);
__decorate([
    (0, common_1.Put)('orders/:id/delivery-status'),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN, role_entity_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CrmFunnelController.prototype, "updateOrderDeliveryStatus", null);
exports.CrmFunnelController = CrmFunnelController = __decorate([
    (0, common_1.Controller)('crm/funnel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [crm_funnel_service_1.CrmFunnelService])
], CrmFunnelController);
//# sourceMappingURL=crm-funnel.controller.js.map