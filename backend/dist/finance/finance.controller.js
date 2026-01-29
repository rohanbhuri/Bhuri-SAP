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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const invoice_entity_1 = require("../entities/invoice.entity");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    async getDashboardStats(req) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getDashboardStats(organizationId);
    }
    async getAllInvoices(req, page = 1, limit = 10) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getAllInvoices(organizationId, page, limit);
    }
    async getInvoiceById(req, id) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getInvoiceById(id, organizationId);
    }
    async createInvoice(req, createInvoiceDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.financeService.createInvoice(createInvoiceDto, organizationId, userId);
    }
    async updateInvoice(req, id, updateInvoiceDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.financeService.updateInvoice(id, updateInvoiceDto, organizationId, userId);
    }
    async deleteInvoice(req, id) {
        const organizationId = req.user.organizationId;
        return await this.financeService.deleteInvoice(id, organizationId);
    }
    async getInvoicesByStatus(req, status) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getInvoicesByStatus(status, organizationId);
    }
    async getInvoicesByCustomer(req, customerId) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getInvoicesByCustomer(customerId, organizationId);
    }
    async searchInvoices(req, query) {
        const organizationId = req.user.organizationId;
        return await this.financeService.searchInvoices(query, organizationId);
    }
    async getAllReceipts(req, page = 1, limit = 10) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getAllReceipts(organizationId, page, limit);
    }
    async createReceipt(req, createReceiptDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.financeService.createReceipt(createReceiptDto, organizationId, userId);
    }
    async getAllPayments(req, page = 1, limit = 10) {
        const organizationId = req.user.organizationId;
        return await this.financeService.getAllPayments(organizationId, page, limit);
    }
    async createPayment(req, createPaymentDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.financeService.createPayment(createPaymentDto, organizationId, userId);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getAllInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.Post)('invoices'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Put)('invoices/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Delete)('invoices/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "deleteInvoice", null);
__decorate([
    (0, common_1.Get)('invoices/status/:status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoicesByStatus", null);
__decorate([
    (0, common_1.Get)('invoices/customer/:customerId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoicesByCustomer", null);
__decorate([
    (0, common_1.Get)('invoices/search'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "searchInvoices", null);
__decorate([
    (0, common_1.Get)('receipts'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getAllReceipts", null);
__decorate([
    (0, common_1.Post)('receipts'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createReceipt", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createPayment", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map