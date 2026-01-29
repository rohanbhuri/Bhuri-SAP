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
exports.QuotationsController = void 0;
const common_1 = require("@nestjs/common");
const quotations_service_1 = require("./quotations.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const api_key_guard_1 = require("../guards/api-key.guard");
let QuotationsController = class QuotationsController {
    constructor(quotationsService) {
        this.quotationsService = quotationsService;
    }
    async getAllQuotations(req) {
        return this.quotationsService.findAll(req.user.organizationId);
    }
    async getQuotationsByClient(clientId) {
        return this.quotationsService.findByClient(clientId);
    }
    async getQuotation(id) {
        return this.quotationsService.findOne(id);
    }
    async createQuotation(data, req) {
        return this.quotationsService.create(data, req.user.organizationId);
    }
    async createFromEnquiry(enquiryId, req) {
        return this.quotationsService.createFromEnquiry(enquiryId, req.user.userId);
    }
    async updateQuotation(id, data, req) {
        return this.quotationsService.update(id, data, req.user?.userId);
    }
    async submitForApproval(id) {
        return this.quotationsService.submitForApproval(id);
    }
    async approveQuotation(id, req) {
        return this.quotationsService.approve(id, req.user.userId);
    }
    async sendQuotation(id, body) {
        return this.quotationsService.sendQuotation(id, body.via);
    }
    async deleteQuotation(id, req) {
        return this.quotationsService.delete(id, req.user?.userId);
    }
    async createFromWebsiteCart(cartData, req) {
        return this.quotationsService.createFromWebsiteCart(cartData, req.apiKey.organizationId);
    }
    async getAllEnquiries(req) {
        return this.quotationsService.findAllEnquiries(req.user.organizationId);
    }
    async getEnquiry(id) {
        return this.quotationsService.findEnquiry(id);
    }
    async createEnquiry(data, req) {
        return this.quotationsService.createEnquiry(data, req.user.organizationId);
    }
    async updateEnquiry(id, data, req) {
        return this.quotationsService.updateEnquiry(id, data, req.user?.userId);
    }
    async deleteEnquiry(id, req) {
        return this.quotationsService.deleteEnquiry(id, req.user?.userId);
    }
    async getAllTemplates() {
        return this.quotationsService.findAllTemplates();
    }
    async createTemplate(data) {
        return this.quotationsService.createTemplate(data);
    }
    async getAllPresentations(req) {
        return this.quotationsService.findAllPresentations(req.user.organizationId);
    }
    async getPresentation(id) {
        return this.quotationsService.findPresentation(id);
    }
    async createPresentation(data, req) {
        return this.quotationsService.createPresentation(data, req.user.organizationId, req.user.userId);
    }
    async updatePresentation(id, data, req) {
        return this.quotationsService.updatePresentation(id, data, req.user?.userId);
    }
    async markPresentationFinal(id) {
        return this.quotationsService.markPresentationFinal(id);
    }
    async sendPresentationToClient(id) {
        return this.quotationsService.sendPresentationToClient(id);
    }
    async deletePresentation(id, req) {
        return this.quotationsService.deletePresentation(id, req.user?.userId);
    }
    async generatePresentation(id, res) {
        const buffer = await this.quotationsService.generatePPTX(id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename=presentation-${id}.pptx`);
        res.send(buffer);
    }
    async convertPresentationToQuotation(id) {
        return this.quotationsService.convertPresentationToQuotation(id);
    }
    async linkQuotationToPresentation(id, body) {
        return this.quotationsService.linkQuotationToPresentation(id, body.quotationId);
    }
    async downloadQuotationExcel(id, res) {
        const buffer = await this.quotationsService.generateQuotationExcel(id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.xlsx`);
        res.send(buffer);
    }
};
exports.QuotationsController = QuotationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getAllQuotations", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getQuotationsByClient", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getQuotation", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createQuotation", null);
__decorate([
    (0, common_1.Post)('from-enquiry/:enquiryId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('enquiryId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createFromEnquiry", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "updateQuotation", null);
__decorate([
    (0, common_1.Post)(':id/submit-approval'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "submitForApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "approveQuotation", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "sendQuotation", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "deleteQuotation", null);
__decorate([
    (0, common_1.Post)('cart'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createFromWebsiteCart", null);
__decorate([
    (0, common_1.Get)('enquiries/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getAllEnquiries", null);
__decorate([
    (0, common_1.Get)('enquiries/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getEnquiry", null);
__decorate([
    (0, common_1.Post)('enquiries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createEnquiry", null);
__decorate([
    (0, common_1.Put)('enquiries/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "updateEnquiry", null);
__decorate([
    (0, common_1.Delete)('enquiries/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "deleteEnquiry", null);
__decorate([
    (0, common_1.Get)('templates/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getAllTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('presentations/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getAllPresentations", null);
__decorate([
    (0, common_1.Get)('presentations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "getPresentation", null);
__decorate([
    (0, common_1.Post)('presentations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "createPresentation", null);
__decorate([
    (0, common_1.Put)('presentations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "updatePresentation", null);
__decorate([
    (0, common_1.Post)('presentations/:id/mark-final'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "markPresentationFinal", null);
__decorate([
    (0, common_1.Post)('presentations/:id/send-to-client'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "sendPresentationToClient", null);
__decorate([
    (0, common_1.Delete)('presentations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "deletePresentation", null);
__decorate([
    (0, common_1.Post)('presentations/:id/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "generatePresentation", null);
__decorate([
    (0, common_1.Post)('presentations/:id/convert-to-quotation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "convertPresentationToQuotation", null);
__decorate([
    (0, common_1.Post)('presentations/:id/link-quotation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "linkQuotationToPresentation", null);
__decorate([
    (0, common_1.Get)(':id/download-excel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "downloadQuotationExcel", null);
exports.QuotationsController = QuotationsController = __decorate([
    (0, common_1.Controller)('quotations'),
    __metadata("design:paramtypes", [quotations_service_1.QuotationsService])
], QuotationsController);
//# sourceMappingURL=quotations.controller.js.map