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
exports.PayrollItem = exports.PayrollRun = exports.SalaryStructure = void 0;
const typeorm_1 = require("typeorm");
let SalaryStructure = class SalaryStructure {
    constructor() {
        this.earnings = [];
        this.deductions = [];
        this.reimbursements = [];
        this.createdAt = new Date();
    }
};
exports.SalaryStructure = SalaryStructure;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], SalaryStructure.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], SalaryStructure.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "earnings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "reimbursements", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SalaryStructure.prototype, "effectiveFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], SalaryStructure.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SalaryStructure.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SalaryStructure.prototype, "updatedAt", void 0);
exports.SalaryStructure = SalaryStructure = __decorate([
    (0, typeorm_1.Entity)('salary-structures'),
    __metadata("design:paramtypes", [])
], SalaryStructure);
let PayrollRun = class PayrollRun {
    constructor() {
        this.status = 'draft';
        this.items = [];
        this.createdAt = new Date();
    }
};
exports.PayrollRun = PayrollRun;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], PayrollRun.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], PayrollRun.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PayrollRun.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PayrollRun.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], PayrollRun.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], PayrollRun.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], PayrollRun.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], PayrollRun.prototype, "processedAt", void 0);
exports.PayrollRun = PayrollRun = __decorate([
    (0, typeorm_1.Entity)('payroll-runs'),
    __metadata("design:paramtypes", [])
], PayrollRun);
class PayrollItem {
}
exports.PayrollItem = PayrollItem;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], PayrollItem.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PayrollItem.prototype, "gross", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PayrollItem.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PayrollItem.prototype, "net", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], PayrollItem.prototype, "components", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "payslipUrl", void 0);
//# sourceMappingURL=payroll.entity.js.map