"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quotations_controller_1 = require("./quotations.controller");
const quotations_service_1 = require("./quotations.service");
const quotation_entity_1 = require("../entities/quotation.entity");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const email_template_entity_1 = require("../entities/email-template.entity");
const presentation_entity_1 = require("../entities/presentation.entity");
const product_entity_1 = require("../entities/product.entity");
const client_entity_1 = require("../entities/client.entity");
const api_key_module_1 = require("../guards/api-key.module");
const notifications_module_1 = require("../notifications/notifications.module");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
let QuotationsModule = class QuotationsModule {
};
exports.QuotationsModule = QuotationsModule;
exports.QuotationsModule = QuotationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([quotation_entity_1.Quotation, enquiry_entity_1.Enquiry, email_template_entity_1.EmailTemplate, presentation_entity_1.Presentation, product_entity_1.Product, client_entity_1.Client, user_entity_1.User, role_entity_1.Role]),
            api_key_module_1.ApiKeyModule,
            notifications_module_1.NotificationsModule
        ],
        controllers: [quotations_controller_1.QuotationsController],
        providers: [quotations_service_1.QuotationsService],
        exports: [quotations_service_1.QuotationsService]
    })
], QuotationsModule);
//# sourceMappingURL=quotations.module.js.map