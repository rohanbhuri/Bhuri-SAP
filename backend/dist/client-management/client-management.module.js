"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const client_management_controller_1 = require("./client-management.controller");
const client_management_service_1 = require("./client-management.service");
const client_request_entity_1 = require("../entities/client-request.entity");
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const api_key_entity_1 = require("../entities/api-key.entity");
const contact_us_entity_1 = require("../entities/contact-us.entity");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
let ClientManagementModule = class ClientManagementModule {
};
exports.ClientManagementModule = ClientManagementModule;
exports.ClientManagementModule = ClientManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([client_request_entity_1.ClientRequest, client_entity_1.Client, user_entity_1.User, organization_entity_1.Organization, role_entity_1.Role, permission_entity_1.Permission, api_key_entity_1.ApiKey, contact_us_entity_1.ContactUs]),
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'rohanbhuri',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [client_management_controller_1.ClientManagementController],
        providers: [client_management_service_1.ClientManagementService],
        exports: [client_management_service_1.ClientManagementService]
    })
], ClientManagementModule);
//# sourceMappingURL=client-management.module.js.map