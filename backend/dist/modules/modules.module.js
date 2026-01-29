"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const modules_service_1 = require("./modules.service");
const modules_controller_1 = require("./modules.controller");
const module_entity_1 = require("../entities/module.entity");
const organization_entity_1 = require("../entities/organization.entity");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const module_request_entity_1 = require("../entities/module-request.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let ModulesModule = class ModulesModule {
};
exports.ModulesModule = ModulesModule;
exports.ModulesModule = ModulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([module_entity_1.Module, organization_entity_1.Organization, user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission, module_request_entity_1.ModuleRequest]),
            notifications_module_1.NotificationsModule
        ],
        providers: [modules_service_1.ModulesService],
        controllers: [modules_controller_1.ModulesController],
    })
], ModulesModule);
//# sourceMappingURL=modules.module.js.map