"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crm_controller_1 = require("./crm.controller");
const crm_service_1 = require("./crm.service");
const crm_funnel_controller_1 = require("./crm-funnel.controller");
const crm_funnel_service_1 = require("./crm-funnel.service");
const contact_entity_1 = require("../entities/contact.entity");
const lead_entity_1 = require("../entities/lead.entity");
const deal_entity_1 = require("../entities/deal.entity");
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
const organization_entity_1 = require("../entities/organization.entity");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const client_request_entity_1 = require("../entities/client-request.entity");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const presentation_entity_1 = require("../entities/presentation.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const order_entity_1 = require("../entities/order.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const auth_module_1 = require("../auth/auth.module");
let CrmModule = class CrmModule {
};
exports.CrmModule = CrmModule;
exports.CrmModule = CrmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                contact_entity_1.Contact, lead_entity_1.Lead, deal_entity_1.Deal, task_entity_1.Task, user_entity_1.User, organization_entity_1.Organization, role_entity_1.Role, permission_entity_1.Permission,
                client_request_entity_1.ClientRequest, enquiry_entity_1.Enquiry, presentation_entity_1.Presentation, quotation_entity_1.Quotation, order_entity_1.Order, invoice_entity_1.Invoice
            ]),
            auth_module_1.AuthModule
        ],
        controllers: [crm_controller_1.CrmController, crm_funnel_controller_1.CrmFunnelController],
        providers: [crm_service_1.CrmService, crm_funnel_service_1.CrmFunnelService],
        exports: [crm_service_1.CrmService, crm_funnel_service_1.CrmFunnelService]
    })
], CrmModule);
//# sourceMappingURL=crm.module.js.map