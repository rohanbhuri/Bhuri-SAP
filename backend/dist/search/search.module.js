"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const search_controller_1 = require("./search.controller");
const search_service_1 = require("./search.service");
const user_entity_1 = require("../entities/user.entity");
const permission_entity_1 = require("../entities/permission.entity");
const role_entity_1 = require("../entities/role.entity");
const organization_entity_1 = require("../entities/organization.entity");
const employee_entity_1 = require("../entities/employee.entity");
const project_entity_1 = require("../entities/project.entity");
const task_entity_1 = require("../entities/task.entity");
const contact_entity_1 = require("../entities/contact.entity");
const lead_entity_1 = require("../entities/lead.entity");
const deal_entity_1 = require("../entities/deal.entity");
const department_entity_1 = require("../entities/department.entity");
const module_entity_1 = require("../entities/module.entity");
const client_entity_1 = require("../entities/client.entity");
const client_request_entity_1 = require("../entities/client-request.entity");
const product_entity_1 = require("../entities/product.entity");
const blog_post_entity_1 = require("../entities/blog-post.entity");
const page_entity_1 = require("../entities/page.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const order_entity_1 = require("../entities/order.entity");
let SearchModule = class SearchModule {
};
exports.SearchModule = SearchModule;
exports.SearchModule = SearchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                permission_entity_1.Permission,
                role_entity_1.Role,
                organization_entity_1.Organization,
                employee_entity_1.Employee,
                project_entity_1.Project,
                task_entity_1.Task,
                contact_entity_1.Contact,
                lead_entity_1.Lead,
                deal_entity_1.Deal,
                department_entity_1.Department,
                module_entity_1.Module,
                client_entity_1.Client,
                client_request_entity_1.ClientRequest,
                product_entity_1.Product,
                blog_post_entity_1.BlogPost,
                page_entity_1.Page,
                quotation_entity_1.Quotation,
                order_entity_1.Order,
            ]),
        ],
        controllers: [search_controller_1.SearchController],
        providers: [search_service_1.SearchService],
        exports: [search_service_1.SearchService],
    })
], SearchModule);
//# sourceMappingURL=search.module.js.map