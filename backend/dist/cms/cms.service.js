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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_entity_1 = require("../entities/page.entity");
const blog_post_entity_1 = require("../entities/blog-post.entity");
const menu_entity_1 = require("../entities/menu.entity");
const mongodb_1 = require("mongodb");
let CmsService = class CmsService {
    constructor(pageRepository, blogRepository, menuRepository) {
        this.pageRepository = pageRepository;
        this.blogRepository = blogRepository;
        this.menuRepository = menuRepository;
    }
    async findAllPages() {
        return this.pageRepository.find();
    }
    async findOnePage(id) {
        return this.pageRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async findPageBySlug(slug) {
        return this.pageRepository.findOneBy({ slug });
    }
    async createPage(data) {
        const page = this.pageRepository.create(data);
        return this.pageRepository.save(page);
    }
    async updatePage(id, data) {
        data.updatedAt = new Date();
        await this.pageRepository.update(id, data);
        return this.findOnePage(id);
    }
    async deletePage(id) {
        await this.pageRepository.delete(id);
    }
    async findAllBlogs() {
        return this.blogRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOneBlog(id) {
        return this.blogRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async findBlogBySlug(slug) {
        return this.blogRepository.findOneBy({ slug });
    }
    async createBlog(data) {
        const blog = this.blogRepository.create(data);
        return this.blogRepository.save(blog);
    }
    async updateBlog(id, data) {
        data.updatedAt = new Date();
        await this.blogRepository.update(id, data);
        return this.findOneBlog(id);
    }
    async deleteBlog(id) {
        await this.blogRepository.delete(id);
    }
    async findAllMenus() {
        return this.menuRepository.find();
    }
    async findOneMenu(id) {
        return this.menuRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async findMenuByLocation(location) {
        return this.menuRepository.findOneBy({ location, isActive: true });
    }
    async createMenu(data) {
        const menu = this.menuRepository.create(data);
        return this.menuRepository.save(menu);
    }
    async updateMenu(id, data) {
        data.updatedAt = new Date();
        await this.menuRepository.update(id, data);
        return this.findOneMenu(id);
    }
    async deleteMenu(id) {
        await this.menuRepository.delete(id);
    }
    async findAll() {
        return this.findAllPages();
    }
    async findOne(id) {
        return this.findOnePage(id);
    }
    async findBySlug(slug) {
        return this.findPageBySlug(slug);
    }
    async create(data) {
        return this.createPage(data);
    }
    async update(id, data) {
        return this.updatePage(id, data);
    }
    async delete(id) {
        return this.deletePage(id);
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_entity_1.Page)),
    __param(1, (0, typeorm_1.InjectRepository)(blog_post_entity_1.BlogPost)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], CmsService);
//# sourceMappingURL=cms.service.js.map