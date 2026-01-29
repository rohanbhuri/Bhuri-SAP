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
exports.EnquiryController = void 0;
const common_1 = require("@nestjs/common");
const enquiry_service_1 = require("./enquiry.service");
const enquiry_entity_1 = require("../entities/enquiry.entity");
let EnquiryController = class EnquiryController {
    constructor(enquiryService) {
        this.enquiryService = enquiryService;
    }
    async create(createEnquiryDto) {
        return this.enquiryService.createEnquiry(createEnquiryDto);
    }
    async findAll() {
        return this.enquiryService.findAll();
    }
    async findOne(id) {
        return this.enquiryService.findOne(id);
    }
    async updateStatus(id, status) {
        return this.enquiryService.updateStatus(id, status);
    }
    async generateQuotation(id, approvedBy) {
        return this.enquiryService.generateQuotation(id, approvedBy);
    }
};
exports.EnquiryController = EnquiryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/generate-quotation'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('approvedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "generateQuotation", null);
exports.EnquiryController = EnquiryController = __decorate([
    (0, common_1.Controller)('enquiries'),
    __metadata("design:paramtypes", [enquiry_service_1.EnquiryService])
], EnquiryController);
//# sourceMappingURL=enquiry.controller.js.map