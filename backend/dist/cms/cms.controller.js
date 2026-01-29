"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const api_key_guard_1 = require("../guards/api-key.guard");
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async getAllPages() {
        return this.cmsService.findAll();
    }
    async getPage(id) {
        return this.cmsService.findOne(id);
    }
    async getPageBySlug(slug) {
        return this.cmsService.findBySlug(slug);
    }
    async createPage(data) {
        return this.cmsService.create(data);
    }
    async updatePage(id, data) {
        return this.cmsService.update(id, data);
    }
    async deletePage(id) {
        return this.cmsService.delete(id);
    }
    async getAllBlogs() {
        return this.cmsService.findAllBlogs();
    }
    async getBlog(id) {
        return this.cmsService.findOneBlog(id);
    }
    async getBlogBySlug(slug) {
        return this.cmsService.findBlogBySlug(slug);
    }
    async createBlog(data) {
        return this.cmsService.createBlog(data);
    }
    async updateBlog(id, data) {
        return this.cmsService.updateBlog(id, data);
    }
    async deleteBlog(id) {
        return this.cmsService.deleteBlog(id);
    }
    async getAllMenus() {
        return this.cmsService.findAllMenus();
    }
    async getMenu(id) {
        return this.cmsService.findOneMenu(id);
    }
    async getMenuByLocation(location) {
        return this.cmsService.findMenuByLocation(location);
    }
    async createMenu(data) {
        return this.cmsService.createMenu(data);
    }
    async updateMenu(id, data) {
        return this.cmsService.updateMenu(id, data);
    }
    async deleteMenu(id) {
        return this.cmsService.deleteMenu(id);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, common_1.Get)('pages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getAllPages", null);
__decorate([
    (0, common_1.Get)('pages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPage", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getPageBySlug", null);
__decorate([
    (0, common_1.Post)('pages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "createPage", null);
__decorate([
    (0, common_1.Put)('pages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Delete)('pages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "deletePage", null);
__decorate([
    (0, common_1.Get)('blogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)('blogs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getBlog", null);
__decorate([
    (0, common_1.Get)('blog/slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getBlogBySlug", null);
__decorate([
    (0, common_1.Post)('blogs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "createBlog", null);
__decorate([
    (0, common_1.Put)('blogs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.Delete)('blogs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.Get)('menus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getAllMenus", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Get)('menu/location/:location'),
    __param(0, (0, common_1.Param)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getMenuByLocation", null);
__decorate([
    (0, common_1.Post)('menus'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Put)('menus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "updateMenu", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "deleteMenu", null);
exports.CmsController = CmsController = __decorate([
    (0, common_1.Controller)('cms'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map