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
exports.Enquiry = exports.EnquirySource = exports.EnquiryStatus = void 0;
const typeorm_1 = require("typeorm");
var EnquiryStatus;
(function (EnquiryStatus) {
    EnquiryStatus["NEW"] = "new";
    EnquiryStatus["PROCESSING"] = "processing";
    EnquiryStatus["PRESENTATION_SENT"] = "presentation_sent";
    EnquiryStatus["QUOTED"] = "quoted";
    EnquiryStatus["CONVERTED"] = "converted";
    EnquiryStatus["LOST"] = "lost";
    EnquiryStatus["ON_HOLD"] = "on_hold";
    EnquiryStatus["CLOSED"] = "closed";
})(EnquiryStatus || (exports.EnquiryStatus = EnquiryStatus = {}));
var EnquirySource;
(function (EnquirySource) {
    EnquirySource["WEBSITE"] = "website";
    EnquirySource["EMAIL"] = "email";
    EnquirySource["PHONE"] = "phone";
    EnquirySource["WALK_IN"] = "walk_in";
    EnquirySource["REFERRAL"] = "referral";
})(EnquirySource || (exports.EnquirySource = EnquirySource = {}));
let Enquiry = class Enquiry {
    constructor() {
        this.items = [];
        this.status = EnquiryStatus.NEW;
        this.source = EnquirySource.WEBSITE;
        this.createdAt = new Date();
    }
};
exports.Enquiry = Enquiry;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Enquiry.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "enquiryNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], Enquiry.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EnquirySource, default: EnquirySource.WEBSITE }),
    __metadata("design:type", String)
], Enquiry.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EnquiryStatus, default: EnquiryStatus.NEW }),
    __metadata("design:type", String)
], Enquiry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "quotationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "presentationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "clientRequestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "lostReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Enquiry.prototype, "followUpDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "leadId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Enquiry.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Enquiry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Enquiry.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Enquiry.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Enquiry.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Enquiry.prototype, "deletedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: [] }),
    __metadata("design:type", Array)
], Enquiry.prototype, "changeLog", void 0);
exports.Enquiry = Enquiry = __decorate([
    (0, typeorm_1.Entity)('enquiries'),
    __metadata("design:paramtypes", [])
], Enquiry);
//# sourceMappingURL=enquiry.entity.js.map