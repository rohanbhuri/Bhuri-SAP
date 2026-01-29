"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hr_management_controller_1 = require("./hr-management.controller");
const hr_management_service_1 = require("./hr-management.service");
const employee_entity_1 = require("../entities/employee.entity");
const department_entity_1 = require("../entities/department.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const auth_module_1 = require("../auth/auth.module");
const attendance_entity_1 = require("../entities/attendance.entity");
const leave_entity_1 = require("../entities/leave.entity");
const shift_entity_1 = require("../entities/shift.entity");
const holiday_entity_1 = require("../entities/holiday.entity");
const payroll_entity_1 = require("../entities/payroll.entity");
const performance_entity_1 = require("../entities/performance.entity");
const compliance_entity_1 = require("../entities/compliance.entity");
const document_entity_1 = require("../entities/document.entity");
const asset_entity_1 = require("../entities/asset.entity");
const messages_module_1 = require("../messages/messages.module");
let HrManagementModule = class HrManagementModule {
};
exports.HrManagementModule = HrManagementModule;
exports.HrManagementModule = HrManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                employee_entity_1.Employee,
                department_entity_1.Department,
                user_entity_1.User,
                organization_entity_1.Organization,
                role_entity_1.Role,
                permission_entity_1.Permission,
                attendance_entity_1.Attendance,
                leave_entity_1.LeaveRequest,
                shift_entity_1.Shift,
                holiday_entity_1.Holiday,
                payroll_entity_1.SalaryStructure,
                payroll_entity_1.PayrollRun,
                performance_entity_1.Goal,
                performance_entity_1.ReviewCycle,
                performance_entity_1.Feedback,
                compliance_entity_1.ComplianceItem,
                compliance_entity_1.ComplianceEvent,
                compliance_entity_1.AuditLog,
                document_entity_1.DocumentRecord,
                asset_entity_1.Asset,
                asset_entity_1.AssetAssignment,
            ]),
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule,
        ],
        controllers: [hr_management_controller_1.HrManagementController],
        providers: [hr_management_service_1.HrManagementService],
        exports: [hr_management_service_1.HrManagementService],
    })
], HrManagementModule);
//# sourceMappingURL=hr-management.module.js.map