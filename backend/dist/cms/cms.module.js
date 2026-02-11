"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cms_controller_1 = require("./cms.controller");
const cms_service_1 = require("./cms.service");
const page_entity_1 = require("../entities/page.entity");
const blog_post_entity_1 = require("../entities/blog-post.entity");
const menu_entity_1 = require("../entities/menu.entity");
const news_media_entity_1 = require("../entities/news-media.entity");
const api_key_module_1 = require("../guards/api-key.module");
const media_controller_1 = require("./media.controller");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([page_entity_1.Page, blog_post_entity_1.BlogPost, menu_entity_1.Menu, news_media_entity_1.NewsMedia]),
            api_key_module_1.ApiKeyModule
        ],
        controllers: [cms_controller_1.CmsController, media_controller_1.MediaController],
        providers: [cms_service_1.CmsService],
        exports: [cms_service_1.CmsService]
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map