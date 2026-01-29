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
exports.ProjectTeamAssignment = void 0;
const typeorm_1 = require("typeorm");
let ProjectTeamAssignment = class ProjectTeamAssignment {
    constructor() {
        this.permissions = ['view'];
        this.isActive = true;
        this.createdAt = new Date();
    }
};
exports.ProjectTeamAssignment = ProjectTeamAssignment;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectTeamAssignment.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectTeamAssignment.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectTeamAssignment.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectTeamAssignment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectTeamAssignment.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], ProjectTeamAssignment.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectTeamAssignment.prototype, "assignedDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectTeamAssignment.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProjectTeamAssignment.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], ProjectTeamAssignment.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ProjectTeamAssignment.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectTeamAssignment.prototype, "createdAt", void 0);
exports.ProjectTeamAssignment = ProjectTeamAssignment = __decorate([
    (0, typeorm_1.Entity)('project_team_assignments'),
    __metadata("design:paramtypes", [])
], ProjectTeamAssignment);
//# sourceMappingURL=project-team-assignment.entity.js.map