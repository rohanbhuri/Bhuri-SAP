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
exports.Timesheet = exports.TimesheetEntry = void 0;
const typeorm_1 = require("typeorm");
let TimesheetEntry = class TimesheetEntry {
    constructor() {
        this.status = 'draft';
        this.billable = true;
        this.invoiced = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.TimesheetEntry = TimesheetEntry;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "deliverableId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TimesheetEntry.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TimesheetEntry.prototype, "totalHours", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "workType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], TimesheetEntry.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TimesheetEntry.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TimesheetEntry.prototype, "billable", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TimesheetEntry.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TimesheetEntry.prototype, "billingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TimesheetEntry.prototype, "invoiced", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String, nullable: true }),
    __metadata("design:type", typeorm_1.ObjectId)
], TimesheetEntry.prototype, "invoiceId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TimesheetEntry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TimesheetEntry.prototype, "updatedAt", void 0);
exports.TimesheetEntry = TimesheetEntry = __decorate([
    (0, typeorm_1.Entity)('timesheet_entries'),
    __metadata("design:paramtypes", [])
], TimesheetEntry);
let Timesheet = class Timesheet {
    constructor() {
        this.status = 'draft';
        this.createdAt = new Date();
    }
};
exports.Timesheet = Timesheet;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Timesheet.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], Timesheet.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], Timesheet.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Timesheet.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Timesheet.prototype, "hoursWorked", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Timesheet.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Timesheet.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], Timesheet.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Timesheet.prototype, "createdAt", void 0);
exports.Timesheet = Timesheet = __decorate([
    (0, typeorm_1.Entity)('timesheets'),
    __metadata("design:paramtypes", [])
], Timesheet);
//# sourceMappingURL=timesheet.entity.js.map