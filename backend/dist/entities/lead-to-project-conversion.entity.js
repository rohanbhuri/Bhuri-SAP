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
exports.LeadToProjectConversion = void 0;
const typeorm_1 = require("typeorm");
let LeadToProjectConversion = class LeadToProjectConversion {
    constructor() {
        this.status = 'converted';
        this.createdAt = new Date();
    }
};
exports.LeadToProjectConversion = LeadToProjectConversion;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], LeadToProjectConversion.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], LeadToProjectConversion.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], LeadToProjectConversion.prototype, "leadId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], LeadToProjectConversion.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], LeadToProjectConversion.prototype, "convertedBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], LeadToProjectConversion.prototype, "conversionDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeadToProjectConversion.prototype, "conversionReason", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeadToProjectConversion.prototype, "leadValue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeadToProjectConversion.prototype, "projectBudget", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LeadToProjectConversion.prototype, "estimatedDuration", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeadToProjectConversion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], LeadToProjectConversion.prototype, "createdAt", void 0);
exports.LeadToProjectConversion = LeadToProjectConversion = __decorate([
    (0, typeorm_1.Entity)('lead_to_project_conversions'),
    __metadata("design:paramtypes", [])
], LeadToProjectConversion);
//# sourceMappingURL=lead-to-project-conversion.entity.js.map