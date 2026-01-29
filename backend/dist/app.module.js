"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const organizations_module_1 = require("./organizations/organizations.module");
const roles_module_1 = require("./roles/roles.module");
const modules_module_1 = require("./modules/modules.module");
const preferences_module_1 = require("./preferences/preferences.module");
const user_management_module_1 = require("./user-management/user-management.module");
const organization_management_module_1 = require("./organization-management/organization-management.module");
const crm_module_1 = require("./crm/crm.module");
const hr_management_module_1 = require("./hr-management/hr-management.module");
const projects_management_module_1 = require("./projects-management/projects-management.module");
const project_tracking_module_1 = require("./project-tracking/project-tracking.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const project_timesheet_module_1 = require("./project-timesheet/project-timesheet.module");
const order_management_module_1 = require("./order-management/order-management.module");
const finance_module_1 = require("./finance/finance.module");
const health_module_1 = require("./health/health.module");
const search_module_1 = require("./search/search.module");
const catalogue_module_1 = require("./catalogue/catalogue.module");
const cms_module_1 = require("./cms/cms.module");
const quotations_module_1 = require("./quotations/quotations.module");
const enquiry_module_1 = require("./enquiry/enquiry.module");
const client_management_module_1 = require("./client-management/client-management.module");
const api_key_module_1 = require("./guards/api-key.module");
const api_key_guard_1 = require("./guards/api-key.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mongodb',
                url: process.env.MONGODB_URI,
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV !== 'production',
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            roles_module_1.RolesModule,
            modules_module_1.ModulesModule,
            preferences_module_1.PreferencesModule,
            user_management_module_1.UserManagementModule,
            organization_management_module_1.OrganizationManagementModule,
            crm_module_1.CrmModule,
            hr_management_module_1.HrManagementModule,
            projects_management_module_1.ProjectsManagementModule,
            project_tracking_module_1.ProjectTrackingModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            project_timesheet_module_1.ProjectTimesheetModule,
            order_management_module_1.OrderManagementModule,
            finance_module_1.FinanceModule,
            search_module_1.SearchModule,
            catalogue_module_1.CatalogueModule,
            cms_module_1.CmsModule,
            quotations_module_1.QuotationsModule,
            enquiry_module_1.EnquiryModule,
            client_management_module_1.ClientManagementModule,
            api_key_module_1.ApiKeyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: api_key_guard_1.ApiKeyGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map