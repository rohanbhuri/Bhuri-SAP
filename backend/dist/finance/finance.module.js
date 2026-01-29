"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const finance_controller_1 = require("./finance.controller");
const finance_service_1 = require("./finance.service");
const invoice_entity_1 = require("../entities/invoice.entity");
const contact_entity_1 = require("../entities/contact.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const order_entity_1 = require("../entities/order.entity");
const auth_module_1 = require("../auth/auth.module");
const messages_module_1 = require("../messages/messages.module");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                invoice_entity_1.Invoice,
                invoice_entity_1.Receipt,
                invoice_entity_1.Payment,
                contact_entity_1.Contact,
                user_entity_1.User,
                organization_entity_1.Organization,
                order_entity_1.Order,
            ]),
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule,
        ],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService],
        exports: [finance_service_1.FinanceService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map