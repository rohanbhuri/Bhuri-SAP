"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectTimesheetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_timesheet_controller_1 = require("./project-timesheet.controller");
const project_timesheet_service_1 = require("./project-timesheet.service");
const timesheet_entity_1 = require("../entities/timesheet.entity");
const project_invoice_entity_1 = require("../entities/project-invoice.entity");
const project_entity_1 = require("../entities/project.entity");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const auth_module_1 = require("../auth/auth.module");
let ProjectTimesheetModule = class ProjectTimesheetModule {
};
exports.ProjectTimesheetModule = ProjectTimesheetModule;
exports.ProjectTimesheetModule = ProjectTimesheetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                timesheet_entity_1.Timesheet,
                timesheet_entity_1.TimesheetEntry,
                project_invoice_entity_1.ProjectInvoice,
                project_entity_1.Project,
                user_entity_1.User,
                role_entity_1.Role,
                permission_entity_1.Permission
            ]),
            auth_module_1.AuthModule
        ],
        controllers: [project_timesheet_controller_1.ProjectTimesheetController],
        providers: [project_timesheet_service_1.ProjectTimesheetService],
        exports: [project_timesheet_service_1.ProjectTimesheetService],
    })
], ProjectTimesheetModule);
//# sourceMappingURL=project-timesheet.module.js.map