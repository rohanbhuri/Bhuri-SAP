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
exports.ProjectMilestone = void 0;
const typeorm_1 = require("typeorm");
let ProjectMilestone = class ProjectMilestone {
    constructor() {
        this.status = 'pending';
        this.progress = 0;
        this.deliverableIds = [];
        this.taskIds = [];
        this.billingMilestone = false;
        this.invoiced = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.ProjectMilestone = ProjectMilestone;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectMilestone.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectMilestone.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectMilestone.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "completedDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectMilestone.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProjectMilestone.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], ProjectMilestone.prototype, "deliverableIds", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], ProjectMilestone.prototype, "taskIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProjectMilestone.prototype, "billingMilestone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ProjectMilestone.prototype, "billingAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProjectMilestone.prototype, "invoiced", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectMilestone.prototype, "updatedAt", void 0);
exports.ProjectMilestone = ProjectMilestone = __decorate([
    (0, typeorm_1.Entity)('project_milestones'),
    __metadata("design:paramtypes", [])
], ProjectMilestone);
//# sourceMappingURL=project-milestone.entity.js.map