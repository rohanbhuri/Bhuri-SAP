"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const enquiry_controller_1 = require("./enquiry.controller");
const enquiry_service_1 = require("./enquiry.service");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const product_entity_1 = require("../entities/product.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let EnquiryModule = class EnquiryModule {
};
exports.EnquiryModule = EnquiryModule;
exports.EnquiryModule = EnquiryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([enquiry_entity_1.Enquiry, quotation_entity_1.Quotation, product_entity_1.Product]),
            notifications_module_1.NotificationsModule
        ],
        controllers: [enquiry_controller_1.EnquiryController],
        providers: [enquiry_service_1.EnquiryService],
        exports: [enquiry_service_1.EnquiryService]
    })
], EnquiryModule);
//# sourceMappingURL=enquiry.module.js.map