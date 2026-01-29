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
exports.ModuleRequest = exports.ModuleRequestStatus = void 0;
const typeorm_1 = require("typeorm");
var ModuleRequestStatus;
(function (ModuleRequestStatus) {
    ModuleRequestStatus["PENDING"] = "pending";
    ModuleRequestStatus["APPROVED"] = "approved";
    ModuleRequestStatus["REJECTED"] = "rejected";
})(ModuleRequestStatus || (exports.ModuleRequestStatus = ModuleRequestStatus = {}));
let ModuleRequest = class ModuleRequest {
    constructor() {
        this.status = ModuleRequestStatus.PENDING;
        this.requestedAt = new Date();
    }
};
exports.ModuleRequest = ModuleRequest;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], ModuleRequest.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ModuleRequest.prototype, "moduleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ModuleRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ModuleRequest.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ModuleRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ModuleRequest.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ModuleRequest.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], ModuleRequest.prototype, "processedBy", void 0);
exports.ModuleRequest = ModuleRequest = __decorate([
    (0, typeorm_1.Entity)('module-requests'),
    __metadata("design:paramtypes", [])
], ModuleRequest);
//# sourceMappingURL=module-request.entity.js.map