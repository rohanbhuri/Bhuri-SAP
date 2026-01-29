"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_management_controller_1 = require("./organization-management.controller");
const organization_management_service_1 = require("./organization-management.service");
const organization_entity_1 = require("../entities/organization.entity");
const organization_request_entity_1 = require("../entities/organization-request.entity");
const user_entity_1 = require("../entities/user.entity");
const module_entity_1 = require("../entities/module.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let OrganizationManagementModule = class OrganizationManagementModule {
};
exports.OrganizationManagementModule = OrganizationManagementModule;
exports.OrganizationManagementModule = OrganizationManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization, organization_request_entity_1.OrganizationRequest, user_entity_1.User, module_entity_1.Module, role_entity_1.Role, permission_entity_1.Permission])
        ],
        controllers: [organization_management_controller_1.OrganizationManagementController],
        providers: [organization_management_service_1.OrganizationManagementService],
        exports: [organization_management_service_1.OrganizationManagementService]
    })
], OrganizationManagementModule);
//# sourceMappingURL=organization-management.module.js.map