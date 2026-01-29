"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTrackingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_tracking_controller_1 = require("./project-tracking.controller");
const project_tracking_service_1 = require("./project-tracking.service");
const project_entity_1 = require("../entities/project.entity");
const project_milestone_entity_1 = require("../entities/project-milestone.entity");
const project_deliverable_entity_1 = require("../entities/project-deliverable.entity");
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const auth_module_1 = require("../auth/auth.module");
let ProjectTrackingModule = class ProjectTrackingModule {
};
exports.ProjectTrackingModule = ProjectTrackingModule;
exports.ProjectTrackingModule = ProjectTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                project_milestone_entity_1.ProjectMilestone,
                project_deliverable_entity_1.ProjectDeliverable,
                task_entity_1.Task,
                user_entity_1.User,
                role_entity_1.Role,
                permission_entity_1.Permission
            ]),
            auth_module_1.AuthModule
        ],
        controllers: [project_tracking_controller_1.ProjectTrackingController],
        providers: [project_tracking_service_1.ProjectTrackingService],
        exports: [project_tracking_service_1.ProjectTrackingService],
    })
], ProjectTrackingModule);
//# sourceMappingURL=project-tracking.module.js.map