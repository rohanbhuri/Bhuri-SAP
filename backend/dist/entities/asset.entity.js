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
exports.AssetAssignment = exports.Asset = void 0;
const typeorm_1 = require("typeorm");
let Asset = class Asset {
    constructor() {
        this.createdAt = new Date();
    }
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Asset.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], Asset.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Asset.prototype, "createdAt", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets'),
    __metadata("design:paramtypes", [])
], Asset);
let AssetAssignment = class AssetAssignment {
    constructor() {
        this.assignedAt = new Date();
    }
};
exports.AssetAssignment = AssetAssignment;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], AssetAssignment.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], AssetAssignment.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], AssetAssignment.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], AssetAssignment.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssetAssignment.prototype, "returnedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], AssetAssignment.prototype, "organizationId", void 0);
exports.AssetAssignment = AssetAssignment = __decorate([
    (0, typeorm_1.Entity)('asset-assignments'),
    __metadata("design:paramtypes", [])
], AssetAssignment);
//# sourceMappingURL=asset.entity.js.map