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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quotation = exports.QuotationStatus = void 0;
const typeorm_1 = require("typeorm");
var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus["DRAFT"] = "draft";
    QuotationStatus["PENDING_APPROVAL"] = "pending_approval";
    QuotationStatus["APPROVED"] = "approved";
    QuotationStatus["SENT"] = "sent";
    QuotationStatus["ACCEPTED"] = "accepted";
    QuotationStatus["DECLINED"] = "declined";
    QuotationStatus["EXPIRED"] = "expired";
})(QuotationStatus || (exports.QuotationStatus = QuotationStatus = {}));
let Quotation = class Quotation {
    constructor() {
        this.items = [];
        this.status = QuotationStatus.DRAFT;
        this.currency = 'INR';
        this.createdAt = new Date();
    }
};
exports.Quotation = Quotation;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Quotation.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quotation.prototype, "quotationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quotation.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "enquiryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "presentationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "clientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "clientEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "declineReason", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], Quotation.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Quotation.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', default: 0 }),
    __metadata("design:type", Number)
], Quotation.prototype, "taxTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', default: 0 }),
    __metadata("design:type", Number)
], Quotation.prototype, "discountTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Quotation.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Quotation.prototype, "grandTotal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quotation.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT }),
    __metadata("design:type", String)
], Quotation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "sentVia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quotation.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Quotation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Quotation.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Quotation.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Quotation.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: [] }),
    __metadata("design:type", Array)
], Quotation.prototype, "changeLog", void 0);
exports.Quotation = Quotation = __decorate([
    (0, typeorm_1.Entity)('quotations'),
    __metadata("design:paramtypes", [])
], Quotation);
//# sourceMappingURL=quotation.entity.js.map