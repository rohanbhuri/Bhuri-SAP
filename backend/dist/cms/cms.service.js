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
const news_media_entity_1 = require("../entities/news-media.entity");
const mongodb_1 = require("mongodb");
let CmsService = class CmsService {
    constructor(pageRepository, blogRepository, menuRepository, newsMediaRepository) {
        this.pageRepository = pageRepository;
        this.blogRepository = blogRepository;
        this.menuRepository = menuRepository;
        this.newsMediaRepository = newsMediaRepository;
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
    async createBlog(data, userId) {
        const blog = this.blogRepository.create({
            ...data,
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.blogRepository.save(blog);
    }
    async updateBlog(id, data, userId) {
        const current = await this.findOneBlog(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (!skipFields.includes(key) && current && current[key] !== data[key]) {
                    changes.push(key);
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        data.updatedAt = new Date();
        await this.blogRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneBlog(id);
    }
    async deleteBlog(id, userId) {
        const current = await this.findOneBlog(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Blog soft-deleted' });
        }
        await this.blogRepository.delete(id);
    }
    async toggleBlogFeatured(id) {
        const blog = await this.findOneBlog(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
        blog.isFeatured = !blog.isFeatured;
        blog.updatedAt = new Date();
        await this.blogRepository.save(blog);
        return blog;
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
    async findAllNewsMedia() {
        return this.newsMediaRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOneNewsMedia(id) {
        return this.newsMediaRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async findNewsMediaBySlug(slug) {
        return this.newsMediaRepository.findOneBy({ slug });
    }
    async createNewsMedia(data, userId) {
        const newsMedia = this.newsMediaRepository.create({
            ...data,
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.newsMediaRepository.save(newsMedia);
    }
    async updateNewsMedia(id, data, userId) {
        const current = await this.findOneNewsMedia(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (!skipFields.includes(key) && current && current[key] !== data[key]) {
                    changes.push(key);
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        data.updatedAt = new Date();
        await this.newsMediaRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneNewsMedia(id);
    }
    async deleteNewsMedia(id, userId) {
        const current = await this.findOneNewsMedia(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'News media soft-deleted' });
        }
        await this.newsMediaRepository.delete(id);
    }
    async toggleNewsMediaFeatured(id) {
        const newsMedia = await this.findOneNewsMedia(id);
        if (!newsMedia) {
            throw new Error('News media not found');
        }
        newsMedia.isFeatured = !newsMedia.isFeatured;
        newsMedia.updatedAt = new Date();
        await this.newsMediaRepository.save(newsMedia);
        return newsMedia;
    }
    async getAnalytics() {
        const blogs = await this.blogRepository.find();
        const newsMedia = await this.newsMediaRepository.find();
        const publishedBlogs = blogs.filter(b => b.status === 'published').length;
        const draftBlogs = blogs.filter(b => b.status === 'draft').length;
        const featuredBlogs = blogs.filter(b => b.isFeatured).length;
        const blogTagsMap = new Map();
        blogs.forEach(blog => {
            blog.tags?.forEach(tag => {
                blogTagsMap.set(tag, (blogTagsMap.get(tag) || 0) + 1);
            });
        });
        const topBlogTags = Array.from(blogTagsMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        const publishedNews = newsMedia.filter(n => n.status === 'published').length;
        const draftNews = newsMedia.filter(n => n.status === 'draft').length;
        const featuredNews = newsMedia.filter(n => n.isFeatured).length;
        const newsTagsMap = new Map();
        newsMedia.forEach(news => {
            news.tags?.forEach(tag => {
                newsTagsMap.set(tag, (newsTagsMap.get(tag) || 0) + 1);
            });
        });
        const topNewsTags = Array.from(newsTagsMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentChanges = {
            blogs: blogs.filter(b => b.updatedAt && new Date(b.updatedAt) >= sevenDaysAgo).length,
            newsMedia: newsMedia.filter(n => n.updatedAt && new Date(n.updatedAt) >= sevenDaysAgo).length
        };
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const blogsByMonth = this.groupByMonth(blogs.filter(b => new Date(b.createdAt) >= sixMonthsAgo));
        const newsByMonth = this.groupByMonth(newsMedia.filter(n => new Date(n.createdAt) >= sixMonthsAgo));
        return {
            totalBlogs: blogs.length,
            publishedBlogs,
            draftBlogs,
            featuredBlogs,
            archivedBlogs: blogs.filter(b => b.status === 'archived').length,
            totalNewsMedia: newsMedia.length,
            publishedNews,
            draftNews,
            featuredNews,
            archivedNews: newsMedia.filter(n => n.status === 'archived').length,
            topBlogTags,
            topNewsTags,
            blogsByMonth,
            newsByMonth,
            recentChanges
        };
    }
    groupByMonth(items) {
        const monthMap = new Map();
        items.forEach(item => {
            const date = new Date(item.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
        });
        return Array.from(monthMap.entries())
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
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
    __param(3, (0, typeorm_1.InjectRepository)(news_media_entity_1.NewsMedia)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], CmsService);
//# sourceMappingURL=cms.service.js.map