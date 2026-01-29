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
exports.OrganizationRequest = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let OrganizationRequest = class OrganizationRequest {
    constructor() {
        this.requestedAt = new Date();
        this.status = RequestStatus.PENDING;
    }
};
exports.OrganizationRequest = OrganizationRequest;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], OrganizationRequest.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], OrganizationRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], OrganizationRequest.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING
    }),
    __metadata("design:type", String)
], OrganizationRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OrganizationRequest.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], OrganizationRequest.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], OrganizationRequest.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizationRequest.prototype, "reason", void 0);
exports.OrganizationRequest = OrganizationRequest = __decorate([
    (0, typeorm_1.Entity)('organization_requests'),
    __metadata("design:paramtypes", [])
], OrganizationRequest);
//# sourceMappingURL=organization-request.entity.js.map