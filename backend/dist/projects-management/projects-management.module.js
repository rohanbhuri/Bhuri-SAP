"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const projects_management_controller_1 = require("./projects-management.controller");
const projects_management_service_1 = require("./projects-management.service");
const project_entity_1 = require("../entities/project.entity");
const project_pipeline_entity_1 = require("../entities/project-pipeline.entity");
const project_deliverable_entity_1 = require("../entities/project-deliverable.entity");
const project_milestone_entity_1 = require("../entities/project-milestone.entity");
const lead_to_project_conversion_entity_1 = require("../entities/lead-to-project-conversion.entity");
const project_team_assignment_entity_1 = require("../entities/project-team-assignment.entity");
const lead_entity_1 = require("../entities/lead.entity");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const auth_module_1 = require("../auth/auth.module");
let ProjectsManagementModule = class ProjectsManagementModule {
};
exports.ProjectsManagementModule = ProjectsManagementModule;
exports.ProjectsManagementModule = ProjectsManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                project_pipeline_entity_1.ProjectPipeline,
                project_deliverable_entity_1.ProjectDeliverable,
                project_milestone_entity_1.ProjectMilestone,
                lead_to_project_conversion_entity_1.LeadToProjectConversion,
                project_team_assignment_entity_1.ProjectTeamAssignment,
                lead_entity_1.Lead,
                user_entity_1.User,
                role_entity_1.Role,
                permission_entity_1.Permission
            ]),
            auth_module_1.AuthModule
        ],
        controllers: [projects_management_controller_1.ProjectsManagementController],
        providers: [projects_management_service_1.ProjectsManagementService],
        exports: [projects_management_service_1.ProjectsManagementService]
    })
], ProjectsManagementModule);
//# sourceMappingURL=projects-management.module.js.map