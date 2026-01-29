"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_management_controller_1 = require("./user-management.controller");
const user_management_service_1 = require("./user-management.service");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const module_entity_1 = require("../entities/module.entity");
const organization_entity_1 = require("../entities/organization.entity");
const api_key_entity_1 = require("../entities/api-key.entity");
const auth_module_1 = require("../auth/auth.module");
let UserManagementModule = class UserManagementModule {
};
exports.UserManagementModule = UserManagementModule;
exports.UserManagementModule = UserManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission, module_entity_1.Module, organization_entity_1.Organization, api_key_entity_1.ApiKey]),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'rohanbhuri',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [user_management_controller_1.UserManagementController],
        providers: [user_management_service_1.UserManagementService],
        exports: [user_management_service_1.UserManagementService]
    })
], UserManagementModule);
//# sourceMappingURL=user-management.module.js.map