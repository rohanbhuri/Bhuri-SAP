"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_management_controller_1 = require("./order-management.controller");
const order_management_service_1 = require("./order-management.service");
const order_entity_1 = require("../entities/order.entity");
const contact_entity_1 = require("../entities/contact.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const auth_module_1 = require("../auth/auth.module");
const messages_module_1 = require("../messages/messages.module");
let OrderManagementModule = class OrderManagementModule {
};
exports.OrderManagementModule = OrderManagementModule;
exports.OrderManagementModule = OrderManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                order_entity_1.OrderStatusHistory,
                contact_entity_1.Contact,
                user_entity_1.User,
                organization_entity_1.Organization,
            ]),
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule,
        ],
        controllers: [order_management_controller_1.OrderManagementController],
        providers: [order_management_service_1.OrderManagementService],
        exports: [order_management_service_1.OrderManagementService],
    })
], OrderManagementModule);
//# sourceMappingURL=order-management.module.js.map